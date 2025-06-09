import * as v from "valibot"
import { isDidUri } from "../did-uri"
import type { DidUri } from "../did-uri"

export const didUriSchema = v.custom<DidUri>(isDidUri, "Invalid DID format")

export const didPkhChainIdSchema = v.pipe(
  v.string(),
  v.regex(/^[-a-z0-9]{3,8}:[-_a-zA-Z0-9]{1,32}$/),
  v.transform((val) => val as `${string}:${string}`)
)
