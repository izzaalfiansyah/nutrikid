import type { LoginParams } from "./dto/login.dto";
import type { ChangePassswordParams } from "./dto/change-password.dto";
import { http } from "~/lib/axios";
import { throwError } from "~/lib/throw-error";

export const ACCESSTOKEN = "access_token";
export const REFRESHTOKEN = "refresh_token";

interface Session {
  refresh_token: string;
  access_token: string;
}

export class AuthService {
  static setSession(session: Session) {
    localStorage.setItem(ACCESSTOKEN, session.access_token);
    localStorage.setItem(REFRESHTOKEN, session.refresh_token);
  }

  static getSession() {
    return {
      refresh_token: localStorage.getItem(REFRESHTOKEN) as string,
      access_token: localStorage.getItem(ACCESSTOKEN) as string,
    } as Session;
  }

  static async login(params: LoginParams) {
    try {
      const res = await http().post("/login", params);

      const access_token = res.data.data.access_token;
      const refresh_token = res.data.data.refresh_token;

      AuthService.setSession({ access_token, refresh_token });

      await this.profile();

      return access_token;
    } catch (err: any) {
      throwError(err);
    }
  }

  static async profile(): Promise<Profile | undefined> {
    try {
      const res = await http().get("/profile");
      const profile = res.data.data.profile;

      const authStore = useAuthStore();
      authStore.setUser(profile as any);

      return profile;
    } catch (err: any) {
      throwError(err);
    }
  }

  static async changePassword(params: ChangePassswordParams) {
    try {
      const res = await http().post("/profile/change-password", params);

      return res.data;
    } catch (err) {
      throwError(err);
    }
  }

  static async update(params: Profile) {
    try {
      const res = await http().put("/profile", params);

      return res.data;
    } catch (err) {
      throwError(err);
    }
  }

  static async logout() {
    localStorage.removeItem(ACCESSTOKEN);
    localStorage.removeItem(REFRESHTOKEN);

    const authStore = useAuthStore();
    authStore.logout();

    return true;
  }
}
