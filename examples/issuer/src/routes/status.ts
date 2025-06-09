import { apiSuccessResponse } from "@repo/api-utils/api-response"
import { notFound } from "@repo/api-utils/exceptions"
import { createStatusListCredential, signCredential } from "agentcommercekit"
import { Hono } from "hono"
import { env } from "hono/adapter"
import { getStatusList } from "@/db/queries/status-lists"
import { compressBitString } from "@/lib/utils/compress-bit-string"
import { database } from "@/middleware/database"
import { didResolver } from "@/middleware/did-resolver"
import { issuer } from "@/middleware/issuer"
import type { ApiResponse } from "@repo/api-utils/api-response"
import type { StatusList2021Credential, Verifiable } from "agentcommercekit"
import type { Env } from "hono"

const app = new Hono<Env>()

app.use("*", database())
app.use("*", issuer())
app.use("*", didResolver())

/**
 * GET /status/:listId
 *
 * @description Retrieves a StatusList2021 credential for checking revocation status
 *
 * URL Parameters:
 * - listId: string - ID of the status list to retrieve
 *
 * @returns Signed StatusList2021 credential with compressed bit string
 */
app.get(
  "/:listId",
  async (c): Promise<ApiResponse<Verifiable<StatusList2021Credential>>> => {
    const listId = c.req.param("listId")
    const db = c.get("db")
    const issuer = c.get("issuer")
    const resolver = c.get("resolver")
    const { BASE_URL } = env(c)

    const statusList = await getStatusList(db, parseInt(listId))

    if (!statusList) {
      return notFound("Status list not found")
    }

    const encodedList = compressBitString(statusList.data)

    const credential = createStatusListCredential({
      url: `${BASE_URL}/status/${listId}`,
      encodedList,
      issuer: issuer.did
    })

    const { verifiableCredential } = await signCredential(credential, {
      ...issuer,
      resolver
    })

    return c.json(apiSuccessResponse(verifiableCredential))
  }
)

export default app
