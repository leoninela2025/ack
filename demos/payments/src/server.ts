import { serve } from "@hono/node-server"
import { logger } from "@repo/api-utils/middleware/logger"
import { colors, errorMessage, log, successMessage, logJson } from "@repo/cli-tools"
import {
  createPaymentRequestResponse,
  getDidResolver,
  verifyPaymentReceipt,
  verifyJwt
} from "agentcommercekit"
import { Hono } from "hono"
import { env } from "hono/adapter"
import { HTTPException } from "hono/http-exception"
import { PAYMENT_SERVICE_URL, RECEIPT_SERVICE_URL, chainId } from "./constants"
import { getKeypairInfo } from "./utils/keypair-info"
import type { PaymentRequestInit, Verifiable, PaymentReceiptCredential } from "agentcommercekit"
import type { Env, TypedResponse } from "hono"
import { cors } from "hono/cors"

const app = new Hono<Env>()
app.use(logger())
app.use(cors())

// Constants for payment option IDs
const LOGISTICS_PAYMENT_OPTION_ID = "usdc-logistics-check-v1"
const WARRANTY_PAYMENT_OPTION_ID = "usdc-warranty-check-v1"
const PURCHASE_PAYMENT_OPTION_ID = "stripe-watch-purchase-v1"

/**
 * Simple hono error handler
 */
app.onError((e, c) => {
  if (e instanceof HTTPException) {
    return e.getResponse()
  }

  console.error(colors.red("Error in server:"), e)
  return c.json({ error: e.message }, 500)
})

// Helper to generate payment request init
const createServicePaymentRequest = (
  serverDid: string,
  serverAddress: string,
  paymentOptionId: string,
  amount: number, // in subunits
  currency: string,
  decimals: number,
  network: string,
  receiptSvcUrl: string
): PaymentRequestInit => ({
  id: crypto.randomUUID(),
  paymentOptions: [
    {
      id: paymentOptionId,
      amount,
      decimals,
      currency,
      recipient: network === "stripe" ? serverDid : serverAddress,
      network,
      receiptService: receiptSvcUrl,
      ...(network === "stripe" && { paymentService: PAYMENT_SERVICE_URL }),
    },
  ],
})

// Helper to verify a receipt and its specific paymentOptionId
async function verifyServiceReceipt(
  receiptJwt: string,
  expectedPaymentOptionId: string,
  c: any // Hono context
): Promise<Verifiable<PaymentReceiptCredential> | null> {
  const serverIdentity = await getKeypairInfo(env(c).SERVER_PRIVATE_KEY_HEX)
  const didResolver = getDidResolver()
  const { did: receiptIssuerDid } = await getKeypairInfo(
    env(c).RECEIPT_SERVICE_PRIVATE_KEY_HEX // This is the DID of the receipt service we trust
  )
  const trustedReceiptIssuers: string[] = [receiptIssuerDid]

  try {
    // Step 1: Verify the overall receipt validity (signature, issuer, embedded payment token)
    await verifyPaymentReceipt(receiptJwt, {
      resolver: didResolver,
      trustedReceiptIssuers,
      paymentRequestIssuer: serverIdentity.did, // This server issued the original payment request
      verifyPaymentTokenJwt: true,
    })

    // Step 2: Decode the JWT to inspect its payload for the paymentOptionId
    const decodedVcPayload = (await verifyJwt(receiptJwt, {
      resolver: didResolver,
      policies: { aud: false },
    })).payload as any;

    log(colors.yellow("Server: Decoded VC payload for receipt verification:"));
    logJson(decodedVcPayload);

    // Adjust access to credentialSubject and paymentOptionId
    const credentialSubject = decodedVcPayload?.vc?.credentialSubject;

    if (credentialSubject) {
      log(colors.yellow(`Server: Credential Subject paymentOptionId: ${credentialSubject.paymentOptionId}`));
    } else {
      log(colors.red("Server: Credential Subject (decodedVcPayload.vc.credentialSubject) is undefined in decoded VC."));
    }

    if (credentialSubject?.paymentOptionId !== expectedPaymentOptionId) {
      log(errorMessage(`Receipt paymentOptionId mismatch. Expected ${expectedPaymentOptionId}, got ${credentialSubject?.paymentOptionId}`))
      return null
    }
    // Cast to the expected return type if everything is okay,
    // though the structure of decodedVcPayload is not exactly Verifiable<PaymentReceiptCredential>
    // This might need further type adjustments based on agentcommercekit's actual structures.
    // For now, the goal is to make the logic work.
    return decodedVcPayload.vc as Verifiable<PaymentReceiptCredential>; // Or adjust as needed
  } catch (e) {
    log(errorMessage("Error verifying service receipt"), String(e))
    return null
  }
}

// Endpoint for Logistics Check
app.post("/logistics/quote", async (c) => {
  const serverIdentity = await getKeypairInfo(env(c).SERVER_PRIVATE_KEY_HEX)
  const receipt = c.req.header("Authorization")?.replace("Bearer ", "")

  log(colors.bold("\nServer: Processing /logistics/quote request"))

  if (receipt) {
    const verifiedReceipt = await verifyServiceReceipt(receipt, LOGISTICS_PAYMENT_OPTION_ID, c)
    if (verifiedReceipt) {
      log(successMessage("Logistics receipt verified successfully"))
      return c.json({ message: "Your logistics quote is available: We've confirmed 5-day shipping for your item." })
    } else {
      throw new HTTPException(400, { message: "Invalid or incorrect logistics receipt." })
    }
  } else {
    log(colors.yellow("No logistics receipt found, generating payment request..."))
    const paymentRequestInit = createServicePaymentRequest(
      serverIdentity.did,
      serverIdentity.crypto.address,
      LOGISTICS_PAYMENT_OPTION_ID,
      40000, // $0.04 USDC (6 decimals)
      "USDC",
      6,
      chainId, // eip155:84532 (Base Sepolia)
      RECEIPT_SERVICE_URL
    )
    const paymentRequest402Response = await createPaymentRequestResponse(
      paymentRequestInit,
      {
        issuer: serverIdentity.did,
        signer: serverIdentity.jwtSigner,
        algorithm: serverIdentity.keypair.algorithm,
      }
    )
    log(successMessage("Logistics payment request generated"))
    const logisticsPaymentRequestJson = await paymentRequest402Response.clone().json();
    logJson(logisticsPaymentRequestJson)
    throw new HTTPException(402, { res: paymentRequest402Response })
  }
})

// Endpoint for Warranty Check
app.post("/warranty/check", async (c) => {
  const serverIdentity = await getKeypairInfo(env(c).SERVER_PRIVATE_KEY_HEX)
  const receipt = c.req.header("Authorization")?.replace("Bearer ", "")

  log(colors.bold("\nServer: Processing /warranty/check request"))

  if (receipt) {
    const verifiedReceipt = await verifyServiceReceipt(receipt, WARRANTY_PAYMENT_OPTION_ID, c)
    if (verifiedReceipt) {
      log(successMessage("Warranty receipt verified successfully"))
      return c.json({ message: "Warranty check complete: Authenticity Certificate #XYZ has been verified, and the extended warranty option has been noted." })
    } else {
      throw new HTTPException(400, { message: "Invalid or incorrect warranty receipt." })
    }
  } else {
    log(colors.yellow("No warranty receipt found, generating payment request..."))
    const paymentRequestInit = createServicePaymentRequest(
      serverIdentity.did,
      serverIdentity.crypto.address,
      WARRANTY_PAYMENT_OPTION_ID,
      50000, // $0.05 USDC (6 decimals)
      "USDC",
      6,
      chainId, // eip155:84532 (Base Sepolia)
      RECEIPT_SERVICE_URL
    )
    const paymentRequest402Response = await createPaymentRequestResponse(
      paymentRequestInit,
      {
        issuer: serverIdentity.did,
        signer: serverIdentity.jwtSigner,
        algorithm: serverIdentity.keypair.algorithm,
      }
    )
    log(successMessage("Warranty payment request generated"))
    const warrantyPaymentRequestJson = await paymentRequest402Response.clone().json();
    logJson(warrantyPaymentRequestJson)
    throw new HTTPException(402, { res: paymentRequest402Response })
  }
})

// Endpoint for Watch Purchase
app.post("/purchase/order", async (c) => {
  const serverIdentity = await getKeypairInfo(env(c).SERVER_PRIVATE_KEY_HEX)
  log(colors.bold("\nServer: Processing /purchase/order request"))

  // Step 1: Verify prerequisite receipts
  const logisticsReceiptJwt = c.req.header("X-Logistics-Receipt")
  const warrantyReceiptJwt = c.req.header("X-Warranty-Receipt")

  if (!logisticsReceiptJwt || !warrantyReceiptJwt) {
    throw new HTTPException(400, { message: "Logistics and Warranty receipts are required in X-Logistics-Receipt and X-Warranty-Receipt headers." })
  }

  log(colors.dim("Verifying logistics receipt..."))
  const verifiedLogisticsReceipt = await verifyServiceReceipt(logisticsReceiptJwt, LOGISTICS_PAYMENT_OPTION_ID, c)
  if (!verifiedLogisticsReceipt) {
    throw new HTTPException(400, { message: "Invalid or incorrect Logistics receipt." })
  }
  log(successMessage("Logistics receipt verified successfully for purchase."))

  log(colors.dim("Verifying warranty receipt..."))
  const verifiedWarrantyReceipt = await verifyServiceReceipt(warrantyReceiptJwt, WARRANTY_PAYMENT_OPTION_ID, c)
  if (!verifiedWarrantyReceipt) {
    throw new HTTPException(400, { message: "Invalid or incorrect Warranty receipt." })
  }
  log(successMessage("Warranty receipt verified successfully for purchase."))

  // Step 2: Prerequisites met, proceed with purchase payment
  const purchaseReceiptJwt = c.req.header("Authorization")?.replace("Bearer ", "")
  if (purchaseReceiptJwt) {
    log(colors.dim("Verifying main purchase receipt..."))
    const verifiedPurchaseReceipt = await verifyServiceReceipt(purchaseReceiptJwt, PURCHASE_PAYMENT_OPTION_ID, c)
    if (verifiedPurchaseReceipt) {
      log(successMessage("Main purchase receipt verified successfully!"))
      // In a real scenario, you'd finalize the order here (e.g., save to DB, notify fulfillment)
      return c.json({ message: "Watch purchased! Order #order_id_XYZ, Tracking #tracking_info.", orderId: "order_id_XYZ", trackingInfo: "tracking_info" })
    } else {
      throw new HTTPException(400, { message: "Invalid or incorrect main purchase receipt." })
    }
  } else {
    log(colors.yellow("Logistics & Warranty verified. No main purchase receipt found, generating payment request for watch..."))
    const paymentRequestInit = createServicePaymentRequest(
      serverIdentity.did,
      serverIdentity.crypto.address, // For Stripe, recipient is server DID, but helper handles this.
      PURCHASE_PAYMENT_OPTION_ID,
      25000, // $250 USD (2 decimals for Stripe)
      "USD",
      2,
      "stripe", // Network is Stripe
      RECEIPT_SERVICE_URL
    )
    const paymentRequest402Response = await createPaymentRequestResponse(
      paymentRequestInit,
      {
        issuer: serverIdentity.did,
        signer: serverIdentity.jwtSigner,
        algorithm: serverIdentity.keypair.algorithm,
      }
    )
    log(successMessage("Main purchase payment request generated"))
    throw new HTTPException(402, { res: paymentRequest402Response })
  }
})

serve({
  port: 4567,
  fetch: app.fetch
})

log(successMessage("ACK Pay Demo Server started on port 4567"))
log(colors.dim("Press Ctrl+C to stop."))
