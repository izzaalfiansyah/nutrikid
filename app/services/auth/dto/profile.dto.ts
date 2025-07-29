import moment from "moment";

export interface Profile {
  id: string;
  name: string;
  uuid: string;
  email: string;
  phone: string;
  role: "admin" | "user" | "pakar";
  created_at: Date;
  deleted_at?: Date;
}

export function profileFromJson(data: any): Profile {
  return {
    id: data.id,
    name: data.name,
    uuid: data.uuid,
    email: data.email,
    phone: data.phone,
    role: data.role,
    created_at: moment(data.created_at).toDate(),
    deleted_at: data.deleted_at ? moment(data.deleted_at).toDate() : undefined,
  } as Profile;
}
