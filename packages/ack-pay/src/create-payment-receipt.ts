import { createCredential } from "@agentcommercekit/vc"
import type { DidUri } from "@agentcommercekit/did"
import type { W3CCredential } from "@agentcommercekit/vc"

const PAYMENT_RECEIPT_TYPE = "PaymentReceiptCredential"

interface CreatePaymentReceiptParams {
  paymentToken: string
  paymentOptionId: string
  issuer: DidUri
  payerDid: DidUri
  expirationDate?: Date
  metadata?: Record<string, unknown>
}

/**
 * Create a payment receipt
 *
 * @param params - The {@link CreatePaymentReceiptParams} to use
 * @returns A {@link W3CCredential} with a payment receipt attestation
 */
export function createPaymentReceipt({
  paymentToken,
  paymentOptionId,
  issuer,
  payerDid,
  expirationDate,
  metadata
}: CreatePaymentReceiptParams): W3CCredential {
  const attestation: Record<string, unknown> = {
    paymentToken,
    paymentOptionId
  }

  if (metadata) {
    attestation.metadata = metadata
  }

  return createCredential({
    type: PAYMENT_RECEIPT_TYPE,
    issuer: issuer,
    subject: payerDid,
    expirationDate,
    attestation
  })
}
