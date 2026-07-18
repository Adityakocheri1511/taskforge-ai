import axios from "axios";

const AUTH_URL = import.meta.env.VITE_AUTH_URL;

// Access token: MEMORY ONLY. Never persisted. Gone on reload (the cookie restores it).
let accessToken: string | null = null;
export const setAccessToken = (t: string | null) => { accessToken = t; };
export const getAccessToken = () => accessToken;

// withCredentials -> the browser sends/receives the httpOnly refresh cookie
export const authApi = axios.create({ baseURL: AUTH_URL, withCredentials: true });
export const taskApi = axios.create({
  baseURL: import.meta.env.VITE_TASK_URL,
  withCredentials: true,
});

[authApi, taskApi].forEach((api) => {
  // Attach the access token as a Bearer header — works across every service/domain
  api.interceptors.request.use((config) => {
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  });

  // On 401: refresh once, then retry the original request
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config;
      if (error.response?.status === 401 && !original._retried) {
        original._retried = true;
        try {
          // Empty body — the refresh token rides along as an httpOnly cookie
          const { data } = await axios.post(
            `${AUTH_URL}/api/v1/auth/refresh`,
            {},
            { withCredentials: true }
          );
          setAccessToken(data.access_token);
          original.headers.Authorization = `Bearer ${data.access_token}`;
          return api(original);
        } catch {
          setAccessToken(null);
        }
      }
      return Promise.reject(error);
    }
  );
});