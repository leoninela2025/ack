import "hono"

declare module "hono" {
  interface Env {
    Bindings: {
      // Environment
      BASE_URL: string
      NODE_ENV: "development" | "production" | "test"

      // Issuer
      ISSUER_PRIVATE_KEY: `0x${string}`
    }
  }
}
