export class InvalidPaymentTokenError extends Error {
  constructor(message = "Invalid payment token") {
    super(message)
    this.name = "InvalidPaymentTokenError"
  }
}
