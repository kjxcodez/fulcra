import { serve } from "@hono/node-server"
import { app } from "./app/app"
import { env } from "./config/env"
import { logger } from "./infrastructure/logger"

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    logger.info(`Fulcra API server running on http://localhost:${info.port}`, {
      port: info.port,
      environment: env.API_ENV,
      nodeEnv: env.NODE_ENV,
      version: env.API_VERSION,
    })
  }
)

export { app }
