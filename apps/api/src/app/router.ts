import { Hono } from "hono"
import type { AppEnv } from "../shared/types/context"
import { v1Router } from "./routes"

export const apiRouter = new Hono<AppEnv>()

// Version 1 routes: /api/v1/...
apiRouter.route("/v1", v1Router)

// Architectural Extension Point: Future API versions can be mounted cleanly:
// apiRouter.route("/v2", v2Router)
