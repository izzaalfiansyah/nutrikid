import axios, { AxiosError } from "axios";
import { AuthService } from "~/services/auth/auth.service";
import { jwtDecode } from "jwt-decode";

function isTokenExpired(token: string) {
  const payload = jwtDecode(token);

  return payload.exp || 0 * 1000 < Date.now();
}

export const http = () => {
  const headers: Record<any, any> = {};

  const { access_token, refresh_token } = AuthService.getSession();

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
        access_token &&
        isTokenExpired(access_token) &&
        refresh_token &&
        !(original_request as any)._retry
      ) {
        (original_request as any)._retry = true;

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
    },
  );

  instance.post("/refresh-token", { access_token, refresh_token });

  return instance;
};
