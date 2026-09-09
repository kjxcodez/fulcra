/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "vitest"
import { Hono } from "hono"
import { app } from "../src/app/app"
import { errorHandler, requestId } from "../src/middleware"
import type { AppEnv } from "../src/shared/types/context"

describe("Fulcra API Test Suite", () => {
  describe("GET /api/v1/health", () => {
    it("should return 200 OK with standard success envelope", async () => {
      const res = await app.request("/api/v1/health")

      expect(res.status).toBe(200)

      const body = (await res.json()) as any
      expect(body.success).toBe(true)
      expect(body.data.status).toBe("ok")
      expect(typeof body.data.timestamp).toBe("string")
      expect(typeof body.meta.requestId).toBe("string")
      expect(body.meta.requestId.startsWith("req_")).toBe(true)
      expect(res.headers.get("X-Request-ID")).toBe(body.meta.requestId)
    })

    it("should support query validation and return valid echo parameter", async () => {
      const res = await app.request("/api/v1/health?echo=ping")

      expect(res.status).toBe(200)
      const body = (await res.json()) as any
      expect(body.success).toBe(true)
      expect(body.data.echo).toBe("ping")
    })

    it("should return 400 VALIDATION_ERROR on malformed query parameter", async () => {
      // echo exceeds max 50 characters
      const longString = "a".repeat(100)
      const res = await app.request(`/api/v1/health?echo=${longString}`)

      expect(res.status).toBe(400)
      const body = (await res.json()) as any
      expect(body.success).toBe(false)
      expect(body.error.code).toBe("VALIDATION_ERROR")
      expect(body.error.message).toBe("Request validation failed")
      expect(Array.isArray(body.error.details)).toBe(true)
      expect(body.error.details[0].field).toBe("echo")
      expect(body.meta.requestId).toBeDefined()
    })
  })

  describe("GET /api/v1/version", () => {
    it("should return 200 OK with version metadata", async () => {
      const res = await app.request("/api/v1/version")

      expect(res.status).toBe(200)
      const body = (await res.json()) as any
      expect(body.success).toBe(true)
      expect(body.data.api).toBe("v1")
      expect(body.data.version).toBe("0.1.0")
      expect(typeof body.data.environment).toBe("string")
      expect(body.meta.requestId).toBeDefined()
    })
  })

  describe("404 Not Found Handler", () => {
    it("should return standardized 404 NOT_FOUND error envelope for unknown routes", async () => {
      const res = await app.request("/api/v1/does-not-exist")

      expect(res.status).toBe(404)
      const body = (await res.json()) as any
      expect(body.success).toBe(false)
      expect(body.error.code).toBe("NOT_FOUND")
      expect(body.error.message).toContain(
        "Route GET /api/v1/does-not-exist not found"
      )
      expect(body.meta.requestId).toBeDefined()
      expect(res.headers.get("X-Request-ID")).toBe(body.meta.requestId)
    })
  })

  describe("Request ID Middleware", () => {
    it("should propagate incoming X-Request-ID header", async () => {
      const customId = "req_custom-test-trace-id-12345"
      const res = await app.request("/api/v1/health", {
        headers: {
          "X-Request-ID": customId,
        },
      })

      expect(res.status).toBe(200)
      expect(res.headers.get("X-Request-ID")).toBe(customId)

      const body = (await res.json()) as any
      expect(body.meta.requestId).toBe(customId)
    })
  })

  describe("CORS Middleware", () => {
    it("should include CORS headers when valid origin is supplied", async () => {
      const res = await app.request("/api/v1/health", {
        headers: {
          Origin: "http://localhost:3000",
        },
      })

      expect(res.status).toBe(200)
      expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
        "http://localhost:3000"
      )
      expect(res.headers.get("Access-Control-Expose-Headers")).toContain(
        "X-Request-ID"
      )
    })

    it("should handle preflight OPTIONS requests", async () => {
      const res = await app.request("/api/v1/health", {
        method: "OPTIONS",
        headers: {
          Origin: "http://localhost:3000",
          "Access-Control-Request-Method": "GET",
          "Access-Control-Request-Headers": "X-Request-ID, Content-Type",
        },
      })

      expect(res.status).toBe(204)
      expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
        "http://localhost:3000"
      )
      expect(res.headers.get("Access-Control-Allow-Methods")).toContain("GET")
    })
  })

  describe("Global Error Handler (500 Internal Error Masking)", () => {
    it("should mask unhandled errors and prevent leaking stack traces or sensitive details", async () => {
      const testApp = new Hono<AppEnv>()
      testApp.use("*", requestId())
      testApp.get("/crash", () => {
        throw new Error("Sensitive connection string with password=supersecret")
      })
      testApp.onError(errorHandler)

      const res = await testApp.request("/crash")

      expect(res.status).toBe(500)
      const body = (await res.json()) as any
      expect(body.success).toBe(false)
      expect(body.error.code).toBe("INTERNAL_ERROR")
      expect(body.error.message).toBe(
        "An unexpected error occurred. Please try again later."
      )
      expect(JSON.stringify(body)).not.toContain("supersecret")
      expect(body.error.stack).toBeUndefined()
      expect(body.meta.requestId).toBeDefined()
    })
  })
})
