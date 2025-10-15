import { UserRoundCog, UserRoundSearch, Users } from "lucide-vue-next";

export function roleIcon(role: ProfileRole) {
  switch (role as any) {
    case "superadmin":
      return UserRoundCog;
    case "admin":
      return UserRoundCog;
    case "parent":
      return Users;
    default:
      return UserRoundSearch;
  }
}
