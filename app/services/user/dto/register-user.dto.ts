import type { Profile } from "~/services/auth/dto/profile.dto";

export interface RegisterUser extends Profile {
  password: string;
}
