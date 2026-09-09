export interface ApiResponseMeta {
  requestId: string
  timestamp: string
  pagination?: {
    page: number
    pageSize: number
    total: number
    totalPages?: number
  }
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  meta: ApiResponseMeta
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
  meta: ApiResponseMeta
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    const data = (await response.json()) as ApiResponse<T>
    return data
  } catch (err) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message:
          err instanceof Error ? err.message : "Failed to connect to API",
      },
      meta: {
        requestId: "req_client_error",
        timestamp: new Date().toISOString(),
      },
    }
  }
}
