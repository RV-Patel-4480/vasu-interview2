import { ApiResponse } from "./apiResponse.type"

export type UserRole = 'ADMIN' | 'USER'
export type LoginType = 'EMAIL_PASSWORD' | 'GOOGLE' | 'APPLE'

export interface UserAvatar {
    url: string
    localPath: string
    _id: string
}

export interface User {
    _id: string
    avatar: UserAvatar
    username: string
    email: string
    role: UserRole
    loginType: LoginType
    isEmailVerified: boolean
    createdAt: string
    updatedAt: string
    __v: number
}

// login specific types
export interface LoginPayload {
    username: string
    password: string
}
export interface LoginResponseData {
    user: User
    accessToken: string
    refreshToken: string
}
export type LoginApiResponse = ApiResponse<LoginResponseData>

// register specific types
export interface RegisterPayload {
    email: string
    password: string
    role: UserRole
    username: string
}
export interface RegisterResponseData {
    user: User
}
export type RegisterApiResponse = ApiResponse<RegisterResponseData>

// current user specific types
export type CurrentUserResponseData = User
export type CurrentUserApiResponse = ApiResponse<CurrentUserResponseData>

// logout specific types
export type LogoutResponseData = {} | null
export type LogoutApiResponse = ApiResponse<LogoutResponseData>

// refresh token specific types
export interface RefreshTokenResponseData {
    accessToken: string
    refreshToken: string
}
export type RefreshTokenApiResponse = ApiResponse<RefreshTokenResponseData>
