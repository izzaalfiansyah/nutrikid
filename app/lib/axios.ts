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

  instance.interceptors.response.use(
    (res) => res,
    async (error: any) => {
      const original_request = error.config;

      if (
        !!access_token &&
        !!refresh_token &&
        isTokenExpired(access_token) &&
        error.response.status == 401
      ) {
        try {
          const { data } = await instance.post("/refresh-token", {
            refresh_token,
          });

          const {
            access_token: new_access_token,
            refresh_token: new_refresh_token,
          } = data.data;

          AuthService.setSession({
            access_token: new_access_token,
            refresh_token: new_refresh_token,
          });

          const bearer = `Bearer ${new_access_token}`;

          instance.defaults.headers.common["Authorization"] = bearer;
          original_request.headers["Authorization"] = bearer;

          return instance(original_request);
        } catch (e) {
          AuthService.logout();
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
};
