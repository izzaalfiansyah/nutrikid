import axios, { AxiosError } from "axios";
import { AuthService } from "~/services/auth/auth.service";
import { jwtDecode } from "jwt-decode";

function isTokenExpired(token?: string) {
  if (!token) {
    return false;
  }

  const payload = jwtDecode(token);
  const expirationTime = payload.exp || 0;

  return expirationTime * 1000 < Date.now();
}

export const http = () => {
  const headers: Record<any, any> = {};
  const config = useRuntimeConfig();

  const { access_token, refresh_token } = AuthService.getSession();
  const app_key = config.public.APP_KEY;

  if (app_key) {
    headers["x-app-key"] = app_key;
  }

  if (access_token) {
    headers["Authorization"] = `Bearer ${access_token}`;
  }

  const instance = axios.create({
    baseURL: "/api",
    headers: headers,
  });

  instance.interceptors.request.use(async (config) => {
    const { access_token, refresh_token } = AuthService.getSession();

    if (!!access_token && !!refresh_token && isTokenExpired(access_token)) {
      try {
        const new_access_token = await AuthService.refreshToken(refresh_token);

        config.headers["Authorization"] = `Bearer ${new_access_token}`;
      } catch (e) {
        AuthService.logout();
      }
    }

    return config;
  });

  return instance;
};
