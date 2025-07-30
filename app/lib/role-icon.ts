import { UserRoundCog, UserRoundSearch, Users } from "lucide-vue-next";
import type { ProfileRole } from "~/services/auth/dto/profile.dto";

export function roleIcon(role: ProfileRole) {
  switch (role) {
    case "admin":
      return UserRoundCog;
    case "parent":
      return Users;
    default:
      return UserRoundSearch;
  }
}
