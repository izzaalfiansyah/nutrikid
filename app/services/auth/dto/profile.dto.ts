export interface Profile {
  id: string;
  name: string;
  uuid: string;
  email: string;
  phone: string;
  role: "admin" | "user" | "pakar";
}
