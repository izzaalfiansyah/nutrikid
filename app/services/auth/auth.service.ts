import { supabase } from "~/lib/supabase";
import type { LoginParams } from "./dto/login.dto";
import { useAuthStore } from "~/stores/auth.store";
import type { Profile } from "./dto/profile.dto";

export class AuthService {
  static async login(params: LoginParams) {
    const { data, error } = await supabase().auth.signInWithPassword({
      email: params.email,
      password: params.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    await this.profile();

    return data;
  }

  static async profile() {
    try {
      const { data } = await supabase().auth.getUser();
      const profile = await supabase()
        .from("profiles")
        .select("*")
        .eq("user_id", data.user?.id)
        .single();

      if (!profile.data) {
        return null;
      }

      const authStore = useAuthStore();
      const data_profile = {
        id: profile.data.id,
        email: data.user?.email,
        uuid: data.user?.id,
        name: profile.data.name,
        role: profile.data.role,
        phone: profile.data.phone,
      } as Profile;

      authStore.setUser(data_profile);
      return data_profile;
    } catch (e) {
      return null;
    }
  }

  static async logout() {
    await supabase().auth.signOut();

    return true;
  }
}
