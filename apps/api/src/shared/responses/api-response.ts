import type { Context } from "hono"
import type { ContentfulStatusCode } from "hono/utils/http-status"
import type { ErrorCode } from "../errors/error-codes"
import type {
  ApiErrorResponse,
  ApiResponseMeta,
  ApiSuccessResponse,
  AppEnv,
  PaginationMeta,
} from "../types"

function getMeta(
  c: Context<AppEnv>,
  pagination?: PaginationMeta
): ApiResponseMeta {
  const requestId = c.get("requestId") || "req_unknown"
  return {
    requestId,
    timestamp: new Date().toISOString(),
    ...(pagination ? { pagination } : {}),
  }
}

export function sendSuccess<T>(
  c: Context<AppEnv>,
  data: T,
  status: ContentfulStatusCode = 200
) {
  const payload: ApiSuccessResponse<T> = {
    success: true,
    data,
    meta: getMeta(c),
  }
  return c.json(payload, status)
}

export function sendCollection<T>(
  c: Context<AppEnv>,
  data: T[],
  pagination: PaginationMeta,
  status: ContentfulStatusCode = 200
) {
  const payload: ApiSuccessResponse<T[]> = {
    success: true,
    data,
    meta: getMeta(c, pagination),
  }
  return c.json(payload, status)
}

export function sendError(
  c: Context<AppEnv>,
  code: ErrorCode | string,
  message: string,
  details?: unknown,
  status: ContentfulStatusCode = 400
) {
  const payload: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
    meta: getMeta(c),
  }
  return c.json(payload, status)
}
