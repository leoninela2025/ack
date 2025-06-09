import "hono"

declare module "hono" {
  interface Env {
    Bindings: {
      HOSTNAME: string
      PORT: string
      AGENT_PRIVATE_KEY: `0x${string}`
      CONTROLLER_PRIVATE_KEY: `0x${string}`
    }
  }
}
