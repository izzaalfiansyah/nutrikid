import moment from "moment";
import type { Profile } from "~/services/auth/dto/profile.dto";

export interface Student {
  id: number;
  name: string;
  birth_date: Date;
  male: boolean;
  parent_id?: number;
  parent?: Profile;
  deleted_at?: Date;
}

export function studentFromJson(data: any): Student {
  return {
    id: data.id,
    name: data.name,
    birth_date: moment(data.birth_date).toDate(),
    male: data.male,
    parent_id: data.parent_id,
    parent: data.parent,
    deleted_at: data.deleted_at ? moment(data.deleted_at).toDate() : undefined,
  };
}
