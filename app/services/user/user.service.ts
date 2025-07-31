import { supabase } from "~/lib/supabase";
import { profileFromJson, type Profile } from "../auth/dto/profile.dto";
import type { ChangePasswordOtherParams } from "./dto/change-password-other.dto";
import type { UsersParams } from "./dto/users-params.dto";
import type { RegisterUser } from "./dto/register-user.dto";
import moment from "moment";

export class UserService {
  static async findAll(params?: UsersParams) {
    const limit = params?.limit || 20;
    const page = params?.page || 1;
    const from = (page - 1) * limit;
    const to = from + limit;

    let query = supabase()
      .from("profiles")
      .select("*")

      .order("name", {
        ascending: true,
      })
      .is("deleted_at", null);

    if (params?.search) {
      query = query.ilike("name", `%${params.search}%`);
    }

    if (params?.role) {
      query = query.eq("role", params.role);
    }

    const total = (await query).count;
    const { data, error } = await query.range(from, to);

    if (error) {
      throw new Error("Terjadi kesalahan saat mengambil data pengguna");
    }

    const profiles = data.map((profile) => {
      return profileFromJson({
        ...profile,
      });
    });

    return {
      total,
      profiles,
    };
  }

  static async show(params: Profile) {
    const { data, error } = await supabase().auth.admin.getUserById(
      params.user_id,
    );

    if (error) {
      throw new Error("Gagal mengambil data pengguna");
    }

    return profileFromJson({
      ...params,
      email: data.user.email,
    });
  }

  static async store(params: RegisterUser) {
    const { data, error } = await supabase().auth.admin.createUser({
      email: params.email,
      password: params.password,
      email_confirm: true,
    });

    if (error) {
      throw new Error("Terjadi kesalahan saat membuat pengguna baru");
    }

    const { error: profileError } = await supabase().from("profiles").insert({
      name: params.name,
      user_id: data.user?.id,
      phone: params.phone,
      role: params.role,
    });

    if (profileError) {
      throw new Error("Terjadi kesalahan saat membuat profil pengguna baru");
    }

    return {
      success: true,
      message: "Pengguna baru berhasil ditambahkan",
    };
  }

  static async update(params: Profile) {
    const { error: profileError } = await supabase()
      .from("profiles")
      .update({
        name: params.name,
        phone: params.phone,
        role: params.role,
      })
      .eq("id", params.id);

    if (profileError) {
      throw new Error("Terjadi kesalahan saat mengedit profil pengguna");
    }

    return {
      success: true,
      message: "Pengguna berhasil diedit",
    };
  }

  static async destroy(params: Profile) {
    const { error } = await supabase()
      .from("profiles")
      .update({
        deleted_at: moment().utc().toDate(),
      })
      .eq("id", params.id);

    if (error) {
      throw new Error("Terjadi kesalahan saat menghapus pengguna");
    }

    return {
      success: true,
      message: "Pengguna berhasil dihapus.",
    };
  }

  static async changePassword(params: ChangePasswordOtherParams) {
    const { error } = await supabase().auth.admin.updateUserById(params.uuid, {
      password: params.password,
    });

    if (error) {
      throw new Error("Gagal mengubah password pengguna.");
    }

    return {
      success: true,
      message: "Password pengguna berhasil diubah.",
    };
  }
}
