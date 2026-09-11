import { Hono } from "hono"
import { candidateRoute } from "../features/candidates"
import { healthRoute } from "../features/health"
import { versionRoute } from "../features/version"
import type { AppEnv } from "../shared/types/context"

export const v1Router = new Hono<AppEnv>()

v1Router.route("/health", healthRoute)
v1Router.route("/version", versionRoute)
v1Router.route("/candidate", candidateRoute)
