import axios from "axios";
import { ACCESSTOKEN } from "~/services/auth/auth.service";

export const http = () => {
  const headers: Record<any, any> = {};

  const access_token = localStorage.getItem(ACCESSTOKEN);
  if (access_token) {
    headers["Authorization"] = `Bearer ${access_token}`;
  }

  return axios.create({
    baseURL: "/api",
    headers: headers,
  });
};
