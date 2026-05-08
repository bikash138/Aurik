import axios from "axios";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const localClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "An unexpected error occurred";

    if (error.response) {
      message =
        error.response.data?.error?.message ||
        error.response.data?.message ||
        message;
    } else if (error.request) {
      message = "Server is unreachable";
    } else {
      message = error.message;
    }

    console.error(
      `[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`,
      {
        status: error.response?.status || "NETWORK_ERROR",
        message,
      },
    );

    return Promise.reject(error);
  },
);
