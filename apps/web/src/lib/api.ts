import axios, { type AxiosRequestConfig } from 'axios';

type RetriableRequestConfig = AxiosRequestConfig & {
  __isRetryRequest?: boolean;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = (error.config ?? {}) as RetriableRequestConfig;
    const status = error.response?.status;
    const url = originalRequest.url ?? '';

    if (status === 401) {
      const isRefreshCall = url.includes('/auth/refresh');
      if (isRefreshCall) {
        return Promise.reject(error);
      }
      if (!originalRequest.__isRetryRequest) {
        originalRequest.__isRetryRequest = true;
        try {
          await api.post('/auth/refresh');
          return api.request(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
