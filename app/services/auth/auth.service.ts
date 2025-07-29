import { supabase } from "~/lib/supabase";
import type { LoginParams } from "./dto/login.dto";
import { useAuthStore } from "~/stores/auth.store";
import type { ChangePassswordParams } from "./dto/change-password.dto";
import { profileFromJson, type Profile } from "./dto/profile.dto";

export class AuthService {
  static async login(params: LoginParams) {
    const { data, error } = await supabase().auth.signInWithPassword({
      email: params.email,
      password: params.password,
    });

    if (error) {
      throw new Error("Username atau password salah.");
    }

    await this.profile();

    return data;
  }

  static async profile() {
    try {
      const { data, error } = await supabase().auth.getUser();

      if (error) {
        throw new Error("Silahkan login terlebih dahulu.");
      }

      const profile = await supabase()
        .from("profiles")
        .select("*")
        .eq("user_id", data.user?.id)
        .single();

      if (!profile.data) {
        throw new Error("Profil tidak ditemukan.");
      }

      const authStore = useAuthStore();

      const data_profile = profileFromJson({
        uuid: data.user?.id,
        email: data.user?.email,
        ...profile.data,
      });

      if (data_profile.role != "admin") {
        throw new Error(
          "Kamu bukan admin. Kamu tidak bisa mengakses halaman ini.",
        );
      }
      authStore.setUser(data_profile);

      return data_profile;
    } catch (e) {
      await this.logout();

      return null;
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
