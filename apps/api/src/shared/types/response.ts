import type { ErrorCode } from "../errors/error-codes"

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages?: number
}

export interface ApiResponseMeta {
  requestId: string
  timestamp: string
  pagination?: PaginationMeta
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  meta: ApiResponseMeta
}

export interface ApiErrorDetail {
  code: ErrorCode | string
  message: string
  details?: unknown
}

export interface ApiErrorResponse {
  success: false
  error: ApiErrorDetail
  meta: ApiResponseMeta
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
