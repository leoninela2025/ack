import type { statusList2021ClaimSchema } from "../schemas/valibot"
import type { W3CCredential } from "../types"
import type * as v from "valibot"

type StatusList2021Entry = {
  id: string
  type: "StatusList2021Entry"
  statusPurpose: string
  statusListIndex: string
  statusListCredential: string
}

export type StatusList2021Credential = W3CCredential & {
  credentialSubject: v.InferOutput<typeof statusList2021ClaimSchema>
}

export type Revocable<T extends W3CCredential> = T & {
  credentialStatus: StatusList2021Entry
}
