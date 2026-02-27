import { CurrentUserApiResponse } from "@/types/auth.type";
import apiClient from "./client";

export const updateAvatarApi = async (
    formData: FormData
): Promise<CurrentUserApiResponse> => {
    const res = await apiClient.patch<CurrentUserApiResponse>(
        'api/v1/users/avatar',
        formData
    );
    return res.data;
};