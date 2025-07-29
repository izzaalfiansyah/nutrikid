import type { Profile } from "../auth/dto/profile.dto";
import type { ChangePasswordOtherParams } from "./dto/change-password-other.dto";

export class UserService {
  static async findAll() {}

  static async store(params: Profile) {}

  static async update(params: Profile) {}

  static async destroy(params: Profile) {}

  static async changePassword(params: ChangePasswordOtherParams) {}
}
