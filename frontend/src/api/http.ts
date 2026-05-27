import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '@/stores/auth.store';
import type { AuthTokens, ApiSuccess } from '@/shared/types';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/v1';

export const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

type Subscriber = (token: string | null) => void;
let isRefreshing = false;
let queue: Subscriber[] = [];

const notify = (token: string | null) => {
  queue.forEach((cb) => cb(token));
  queue = [];
};

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const status = error.response?.status;
    const url = originalRequest?.url ?? '';

    const isAuthEndpoint = url.includes('/auth/');
    if (status !== 401 || !originalRequest || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    const { refreshToken, setSession, clear } = useAuthStore.getState();
    if (!refreshToken) {
      clear();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push((token) => {
          if (!token) return reject(error);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(http(originalRequest));
        });
      });
    }

    isRefreshing = true;
    try {
      const { data } = await axios.post<ApiSuccess<AuthTokens>>(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken }
      );
      const tokens = data.data;
      if (!tokens?.accessToken || !tokens.refreshToken || !tokens.user) {
        throw new Error('Refresh response missing fields');
      }
      setSession({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: tokens.user,
      });
      notify(tokens.accessToken);
      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
      return http(originalRequest);
    } catch (refreshError) {
      notify(null);
      clear();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
