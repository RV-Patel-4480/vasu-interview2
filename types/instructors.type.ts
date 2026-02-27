import { ApiResponse, PaginatedResponse } from "./apiResponse.type"

export type Gender = 'male' | 'female'

export interface InstructorName {
    title: string
    first: string
    last: string
}

export interface InstructorStreet {
    number: number
    name: string
}

export interface InstructorCoordinates {
    latitude: string
    longitude: string
}

export interface InstructorTimezone {
    offset: string
    description: string
}

export interface InstructorLocation {
    street: InstructorStreet
    city: string
    state: string
    country: string
    postcode: number | string
    coordinates: InstructorCoordinates
    timezone: InstructorTimezone
}

export interface InstructorLogin {
    uuid: string
    username: string
    password: string
    salt: string
    md5: string
    sha1: string
    sha256: string
}

export interface InstructorDOB {
    date: string
    age: number
}

export interface InstructorRegistered {
    date: string
    age: number
}

export interface InstructorPicture {
    large: string
    medium: string
    thumbnail: string
}

export interface Instructor {
    id: number
    gender: Gender
    name: InstructorName
    location: InstructorLocation
    email: string
    login: InstructorLogin
    dob: InstructorDOB
    registered: InstructorRegistered
    phone: string
    cell: string
    picture: InstructorPicture
    nat: string
}

/* ================================
   API Response Shape
================================ */

export type InstructorApiResponse = ApiResponse<PaginatedResponse<Instructor>>