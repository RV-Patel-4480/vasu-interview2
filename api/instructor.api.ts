
import apiClient from '@/api/client'
import { InstructorApiResponse } from '@/types/instructors.type'

export const fetchInstructors = async (
    page = 1,
    limit = 10
): Promise<InstructorApiResponse> => {
    const res = await apiClient.get<InstructorApiResponse>(
        `api/v1/public/randomusers?page=${page}&limit=${limit}`
    )
    return res.data
}