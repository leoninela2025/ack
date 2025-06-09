import * as v from "valibot"
import type { JwtString } from "../jwt-string"

export const jwtStringSchema = v.pipe(
  v.string(),
  v.regex(/^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$/),
  v.transform((input) => input as JwtString)
)
