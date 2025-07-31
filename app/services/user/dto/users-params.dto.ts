import type { ProfileRole } from "~/services/auth/dto/profile.dto";

export interface UsersParams {
  limit?: number;
  page?: number;
  search?: string;
  role?: ProfileRole;
}
