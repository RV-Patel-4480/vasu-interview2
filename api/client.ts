import { StorageService } from "@/services/storage.service";
import axios from "axios";
import { Alert } from "react-native";
import { refreshTokenApi } from "./auth.api";

const axiosInstance = axios.create({
  baseURL: "https://api.freeapi.app/",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

// Attach token automatically
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await StorageService.getToken();
    console.log("🚀token", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    // console.log("🚀request", JSON.stringify(config, null, 2));

    return config;
  },
  (error) => Promise.reject(error),
);

// Handle responses and errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // console.log("✔️response", response.data);
    return response;
  },
  async (error) => {
    if (!error.response) {
      console.error("error", error);

      Alert.alert("Network Error", "Please check your internet connection.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        Alert.alert("Bad Request", data?.message || "Invalid request.");
        break;

      case 401:
        const originalRequest = error.config;
        console.log(
          "originalRequest",
          JSON.stringify(originalRequest, null, 1),
        );

        if (!originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await refreshTokenApi();
            if (newToken) {
              originalRequest.headers.Authorization = newToken;
              return axiosInstance(originalRequest);
            } else {
              await StorageService.clearAll();
              Alert.alert("Session Expired", "Please log in again.");
            }
          } catch (refreshError) {
            await StorageService.clearAll();
            return Promise.reject(refreshError);
          }
        }
        break;

      case 403:
        Alert.alert(
          "Access Denied",
          "You are not authorized to perform this action.",
        );
        break;

      case 404:
        // Alert.alert("Not Found", "The requested resource was not found.");
        break;

      case 408:
        Alert.alert("Timeout", "Request timeout, please try again.");
        break;

      case 500:
        Alert.alert("Server Error", "Something went wrong on our end.");
        break;

      case 502:
      case 503:
      case 504:
        Alert.alert(
          "Server Unavailable",
          "Server is currently unreachable. Please try again later.",
        );
        break;

      default:
        Alert.alert("Error", data?.message || "An unexpected error occurred.");
        break;
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
