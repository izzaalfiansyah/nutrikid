import { profileFromJson, type Profile } from "../auth/dto/profile.dto";
import type { ChangePasswordOtherParams } from "./dto/change-password-other.dto";
import type { UsersParams } from "./dto/users-params.dto";
import type { RegisterUser } from "./dto/register-user.dto";
import moment from "moment";
import { throwError } from "~/lib/throw-error";
import { http } from "~/lib/axios";

export class UserService {
  static async findAll(params?: UsersParams) {
    try {
      const res = await http().get("/user", {
        params: params,
      });

      return res.data.data;
    } catch (err) {
      throwError(err);
    }
  }

  static async show(params: Profile): Promise<Profile | undefined> {
    try {
      const res = await http().get("/user/" + params.id);

      return res.data.data.user;
    } catch (err) {
      throwError(err);
    }
  }

  static async store(params: RegisterUser) {
    try {
      const res = await http().post("/user", params);

      return res.data;
    } catch (err) {
      throwError(err);
    }
  }

  static async update(params: Profile) {
    try {
      const res = await http().put("/user/" + params.id, params);

      return res.data;
    } catch (err) {
      throwError(err);
    }
  }

  static async destroy(params: Profile) {
    try {
      const res = await http().delete("/user/" + params.id);

      return res.data;
    } catch (err) {
      throwError(err);
    }
  }

  static async changePassword(params: ChangePasswordOtherParams) {
    try {
      const authStore = useAuthStore();
      const res = await http().post("/user/change-password", params);

      if (params.uuid == authStore.user?.user_id) {
        navigateTo("/logout");
      }

      return res.data;
    } catch (err) {
      throwError(err);
    }
  }
}
