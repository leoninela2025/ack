import { errorHandler } from "@repo/api-utils/middleware/error-handler"
import { logger } from "@repo/api-utils/middleware/logger"
import { Hono } from "hono"
import healthcheck from "./routes/healthcheck"
import verify from "./routes/verify"
import wellKnown from "./routes/well-known"
import type { Env } from "hono"

const app = new Hono<Env>()

app.use("*", logger())
app.onError(errorHandler)

app.route("/.well-known", wellKnown)
app.route("/ping", healthcheck)
app.route("/verify", verify)

export default app
