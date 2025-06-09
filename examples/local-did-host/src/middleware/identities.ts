import { env } from "hono/adapter"
import { buildUrl } from "@/lib/build-url"
import { getIdentity } from "@/lib/identity"
import type { Identity } from "@/lib/identity"
import type { Env, MiddlewareHandler } from "hono"

declare module "hono" {
  interface ContextVariableMap {
    identities: {
      agent: Identity
      controller: Identity
    }
  }
}

export function identities(): MiddlewareHandler<Env> {
  return async (c, next) => {
    const { AGENT_PRIVATE_KEY, CONTROLLER_PRIVATE_KEY, HOSTNAME, PORT } = env(c)

    const controller = await getIdentity({
      baseUrl: buildUrl(HOSTNAME, PORT, "/controller"),
      privateKey: CONTROLLER_PRIVATE_KEY,
      alg: "Ed25519"
    })

    const agent = await getIdentity({
      baseUrl: buildUrl(HOSTNAME, PORT, "/agent"),
      privateKey: AGENT_PRIVATE_KEY,
      controller: controller.did,
      alg: "secp256k1"
    })

    c.set("identities", {
      agent,
      controller
    })

    await next()
  }
}
