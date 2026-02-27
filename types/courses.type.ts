import { ApiResponse, PaginatedResponse } from "./apiResponse.type";

export type CourseCategory = string; // e.g. "mens-watches"

export interface Course {
  id: number;
  title?: string;
  description?: string;
  category?: CourseCategory;
  price?: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  thumbnail?: string;
  images?: string[];
}

export type CourseApiResponse = ApiResponse<PaginatedResponse<Course>>;
