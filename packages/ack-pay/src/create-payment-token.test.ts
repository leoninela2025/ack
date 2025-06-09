import {
  createDidDocumentFromKeypair,
  createDidKeyUri,
  getDidResolver
} from "@agentcommercekit/did"
import { createJwtSigner, isJwtString, verifyJwt } from "@agentcommercekit/jwt"
import { generateKeypair } from "@agentcommercekit/keys"
import * as v from "valibot"
import { beforeEach, describe, expect, it } from "vitest"
import { createPaymentToken } from "./create-payment-token"
import { paymentRequestSchema } from "./schemas/valibot"
import type { PaymentRequestInit } from "./payment-request"
import type { DidUri } from "@agentcommercekit/did"
import type { JwtSigner } from "@agentcommercekit/jwt"
import type { Keypair } from "@agentcommercekit/keys"

describe("createPaymentToken()", () => {
  let keypair: Keypair
  let signer: JwtSigner
  let issuerDid: DidUri

  const paymentRequestInit: PaymentRequestInit = {
    id: "test-payment-request-id",
    paymentOptions: [
      {
        id: "test-payment-option-id",
        amount: 10,
        decimals: 2,
        currency: "USD",
        recipient: "sol:123"
      }
    ]
  }
  const paymentRequest = v.parse(paymentRequestSchema, paymentRequestInit)

  beforeEach(async () => {
    keypair = await generateKeypair("secp256k1")
    signer = createJwtSigner(keypair)
    issuerDid = createDidKeyUri(keypair)
  })

  it("generates a paymentToken", async () => {
    const paymentToken = await createPaymentToken(paymentRequest, {
      issuer: issuerDid,
      signer,
      algorithm: keypair.algorithm
    })

    expect(isJwtString(paymentToken)).toBe(true)
  })

  it("generates a valid jwt payment token", async () => {
    const paymentToken = await createPaymentToken(paymentRequest, {
      issuer: issuerDid,
      signer,
      algorithm: keypair.algorithm
    })

    const resolver = getDidResolver()
    resolver.addToCache(
      issuerDid,
      createDidDocumentFromKeypair({
        did: issuerDid,
        keypair
      })
    )

    // Verify the JWT is valid (disable audience validation)
    // TODO: Use parsePaymentToken when it returns the issuer
    const result = await verifyJwt(paymentToken, {
      resolver
    })

    expect(result.payload.iss).toBe(issuerDid)
    expect(result.payload.sub).toBe(paymentRequest.id)
  })
})
