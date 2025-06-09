import type { PaymentRequest } from "agentcommercekit"

/**
 * Custom error class for 402 Payment Required responses
 */
export class PaymentRequiredError extends Error {
  paymentRequest: PaymentRequest
  paymentToken: string

  constructor(paymentRequest: PaymentRequest, paymentToken: string) {
    super("402 Payment Required")
    this.name = "PaymentRequiredError"
    this.paymentRequest = paymentRequest
    this.paymentToken = paymentToken
  }
}
