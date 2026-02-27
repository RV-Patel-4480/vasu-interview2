import apiClient from "@/api/client";
import { StorageService } from "@/services/storage.service";
import {
  CurrentUserApiResponse,
  LoginApiResponse,
  LoginPayload,
  LogoutApiResponse,
  RefreshTokenApiResponse,
  RegisterApiResponse,
  RegisterPayload,
} from "@/types/auth.type";
import axios from "axios";

export const loginApi = async (
  payload: LoginPayload,
): Promise<LoginApiResponse> => {
  const res = await apiClient.post<LoginApiResponse>(
    "api/v1/users/login",
    payload,
  );
  return res.data;
};

export const registerApi = async (
  payload: RegisterPayload,
): Promise<RegisterApiResponse> => {
  const res = await apiClient.post<RegisterApiResponse>(
    "api/v1/users/register",
    payload,
  );
  return res.data;
};

export const currentUserApi = async (): Promise<CurrentUserApiResponse> => {
  const res = await apiClient.get<CurrentUserApiResponse>(
    "api/v1/users/current-user",
  );
  return res.data;
};

export const logoutApi = async (): Promise<LogoutApiResponse> => {
  const res = await apiClient.post<LogoutApiResponse>("api/v1/users/logout");
  return res.data;
};

export const refreshTokenApi = async (): Promise<string | null> => {
  try {
    const refreshToken = await StorageService.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token");

    const res = await axios.post<RefreshTokenApiResponse>(
      "https://api.freeapi.app/api/v1/users/refresh-token",
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      },
    );

    if (res.data.success && res.data.data) {
      const { accessToken, refreshToken: newRefreshToken } = res.data.data;
      await StorageService.setToken(accessToken);
      await StorageService.setRefreshToken(newRefreshToken);
      return accessToken;
    } else {
      await StorageService.clearAll();

      return null;
    }
  } catch (error) {
    console.error("Refresh token failed:", error);
    await StorageService.clearAll();
    return null;
  }
};
