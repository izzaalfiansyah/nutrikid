import moment from "moment";

export type ProfileRole = "admin" | "teacher" | "expert" | "superadmin";

export interface Profile {
  id: number;
  name: string;
  username: string;
  phone: string;
  role: ProfileRole;
  school_id?: number;
  school?: School;
  created_at: Date;
  deleted_at?: Date;
}

export function profileFromJson(data: any): Profile {
  return {
    id: data?.id,
    name: data?.name,
    username: data?.username,
    phone: data?.phone,
    role: data?.role,
    created_at: moment(data?.created_at).toDate(),
    deleted_at: data?.deleted_at ? moment(data.deleted_at).toDate() : undefined,
  } as Profile;
}

export function letterName(name?: string) {
  name = name || "NK";
  const names = name.split(" ");

  if (names.length > 1) {
    return ((names as any)[0][0] + (names as any)[1][0]).toUpperCase();
  }

  return name.substring(0, 2).toUpperCase();
}

export function mappedRole(role: ProfileRole) {
  switch (role as any) {
    case "superadmin":
      return "Superadmin";
    case "admin":
      return "Admin";
    case "teacher":
      return "Guru";
    case "parent":
      return "Orang Tua";
    case "expert":
      return "Ahli Gizi";
    default:
      return "Guru";
  }
}
