/* ================================
   Base API Response Types
================================ */

export interface ApiResponse<T> {
    statusCode: number
    data: T
    message: string
    success: boolean
}

/* ================================
   Pagination Types
================================ */

export interface PaginatedResponse<T> {
    page: number
    limit: number
    totalPages: number
    previousPage: boolean
    nextPage: boolean
    totalItems: number
    currentPageItems: number
    data: T[]
}
