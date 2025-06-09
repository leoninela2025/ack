import { logger as honoLogger } from "hono/logger"

export function logger() {
  return honoLogger((message, ...rest) => {
    if (process.env.NODE_ENV === "test") {
      return
    }

    console.log(message, ...rest)
  })
}
