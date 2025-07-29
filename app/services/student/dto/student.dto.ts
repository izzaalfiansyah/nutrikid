import type { Profile } from "~/services/auth/dto/profile.dto";

export interface Student {
  id: number;
  name: string;
  birth_date: string;
  male: boolean;
  parent_id?: number;
  parent?: Profile;
  deleted_at?: Date;
}
