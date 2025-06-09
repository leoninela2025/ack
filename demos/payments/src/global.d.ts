import "hono"

declare module "hono" {
  interface Env {
    Bindings: {
      SERVER_PRIVATE_KEY_HEX: string
      RECEIPT_SERVICE_PRIVATE_KEY_HEX: string
      PAYMENT_SERVICE_PRIVATE_KEY_HEX: string
    }
  }
}
