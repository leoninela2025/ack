import * as v from "valibot"
import { createPaymentToken } from "./create-payment-token"
import { paymentRequestSchema } from "./schemas/valibot"
import type { PaymentTokenOptions } from "./create-payment-token"
import type { PaymentRequestInit } from "./payment-request"
import type { paymentRequestBodySchema } from "./schemas/valibot"

export type PaymentRequestBody = v.InferOutput<typeof paymentRequestBodySchema>

/**
 * Create a payment request body
 *
 * @param params - The payment config params, including the amount, currency, and recipient
 * @param options - The {@link PaymentTokenOptions} to use
 * @returns A payment request body
 */
export async function createPaymentRequestBody(
  paymentRequestInit: PaymentRequestInit,
  { issuer, signer, algorithm }: PaymentTokenOptions
): Promise<PaymentRequestBody> {
  const paymentRequest = v.parse(paymentRequestSchema, paymentRequestInit)
  const paymentToken = await createPaymentToken(paymentRequest, {
    issuer,
    signer,
    algorithm
  })

  return {
    paymentRequest,
    paymentToken
  }
}

/**
 * Create a 402 `Response` object with the payment request body
 *
 * @param params - The payment config params
 * @param options - The {@link PaymentTokenOptions} to use
 * @returns A 402 `Response` object with the payment request body
 */
export async function createPaymentRequestResponse(
  params: PaymentRequestInit,
  options: PaymentTokenOptions
): Promise<Response> {
  const paymentRequiredBody = await createPaymentRequestBody(params, options)

  return new Response(JSON.stringify(paymentRequiredBody), {
    status: 402,
    headers: {
      "Content-Type": "application/json"
    }
  })
}
