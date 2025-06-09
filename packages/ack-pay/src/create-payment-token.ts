import { createJwt } from "@agentcommercekit/jwt"
import type { PaymentRequest } from "./payment-request"
import type { DidUri } from "@agentcommercekit/did"
import type { JwtAlgorithm, JwtSigner, JwtString } from "@agentcommercekit/jwt"

export interface PaymentTokenOptions {
  /**
   * The issuer of the payment token
   */
  issuer: DidUri
  /**
   * The signer of the payment token
   */
  signer: JwtSigner
  /**
   * The algorithm of the payment token
   */
  algorithm: JwtAlgorithm
}

/**
 * Builds a signed JWT payment token for a given payment request
 *
 * @param paymentRequest - A valid PaymentRequest to create a payment token for
 * @param options - The {@link PaymentTokenOptions} to use
 * @returns A signed JWT payment token
 */
export async function createPaymentToken(
  paymentRequest: PaymentRequest,
  { issuer, signer, algorithm }: PaymentTokenOptions
): Promise<JwtString> {
  return createJwt(
    { ...paymentRequest, sub: paymentRequest.id },
    {
      issuer,
      signer
    },
    {
      alg: algorithm
    }
  )
}
