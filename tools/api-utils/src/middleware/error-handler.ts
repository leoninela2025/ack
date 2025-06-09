import { InvalidPaymentTokenError } from "@agentcommercekit/ack-pay"
import { DidResolutionError } from "@agentcommercekit/did"
import { CredentialVerificationError } from "@agentcommercekit/vc"
import { HTTPException } from "hono/http-exception"
import * as v from "valibot"
import { formatErrorResponse } from "../api-response"
import type { Env, ErrorHandler } from "hono"

export const errorHandler: ErrorHandler<Env> = (err, c) => {
  if (
    err instanceof DidResolutionError ||
    err instanceof CredentialVerificationError ||
    err instanceof InvalidPaymentTokenError
  ) {
    return c.json(formatErrorResponse(err), 400)
  }

  if (v.isValiError(err)) {
    return c.json(formatErrorResponse(err), 400)
  }

  if (err instanceof HTTPException) {
    if (err.status >= 500 && process.env.NODE_ENV !== "test") {
      console.error(err.stack)
    }

    if (err.res) {
      return err.res
    }

    return c.json(formatErrorResponse(err), err.status)
  }

  if (process.env.NODE_ENV !== "test") {
    console.error(err.stack)
  }

  return c.json(formatErrorResponse(err), 500)
}
