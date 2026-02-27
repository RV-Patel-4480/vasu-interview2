import apiClient from "@/api/client";
import { CourseApiResponse } from "@/types/courses.type";

export const fetchCourses = async (
  page = 1,
  limit = 10,
  query = "smartphones",
): Promise<CourseApiResponse> => {
  const res = await apiClient.get<CourseApiResponse>(
    `api/v1/public/randomproducts?page=${page}&limit=${limit}`,
  );
  return res.data;
};
