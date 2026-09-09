import { cors as honoCors } from "hono/cors"
import { env } from "../config/env"

export function cors() {
  const allowedOrigins = env.WEB_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

  return honoCors({
    origin: (origin) => {
      if (!origin) {
        return allowedOrigins[0] || "http://localhost:3000"
      }
      if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return origin
      }
      return null
    },
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
    exposeHeaders: ["X-Request-ID"],
    maxAge: 86400,
    credentials: true,
  })
}
