import type { LoginParams } from "./dto/login.dto";
import type { ChangePassswordParams } from "./dto/change-password.dto";
import { http } from "~/lib/axios";

export const ACCESSTOKEN = "access_token";
export const REFRESHTOKEN = "refresh_token";

export class AuthService {
  static async login(params: LoginParams) {
    try {
      const res = await http().post("/login", params);

      const access_token = res.data.data.access_token;
      const refresh_token = res.data.data.refresh_token;

      localStorage.setItem(ACCESSTOKEN, access_token);
      localStorage.setItem(REFRESHTOKEN, refresh_token);

      await this.profile();

      return access_token;
    } catch (err: any) {
      throw new Error("Username atau password salah");
    }
  }

  static async profile() {
    try {
      const res = await http().get("/profile");
      const profile = res.data.data.profile;

      const authStore = useAuthStore();
      authStore.setUser(profile as any);

      return profile;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  static async changePassword(params: ChangePassswordParams) {
    if (params.password != params.password_confirmation) {
      throw new Error("Password baru tidak sama dengan konfirmasi password.");
    }

    const { data, error } = await supabase().auth.updateUser({
      password: params.password,
    });

    if (error) {
      throw new Error("Gagal mengubah password.");
    }
  }

  static async update(params: Profile) {
    const { error } = await supabase()
      .from("profiles")
      .update({
        name: params.name,
        phone: params.phone,
      })
      .eq("id", params.id);

    if (error) {
      throw new Error("Gagal mengubah profil.");
    }
  }

  static async logout() {
    await supabase().auth.signOut();
    return true;
  }
}
