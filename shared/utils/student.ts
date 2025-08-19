import moment from "moment";
import type { Measurement } from "./measurement";

export type Gender = "l" | "p";

export interface Student {
  id: number;
  nisn: string;
  name: string;
  birth_date: Date;
  gender: Gender;
  deleted_at?: Date;
  age: number;
  age_month: number;
  school_id?: number;
  school?: School;
  measurement?: Measurement;
}

export function studentFromJson(data: any): Student {
  return {
    id: data.id,
    nisn: data.nisn,
    name: data.name,
    birth_date: moment(data.birth_date).toDate(),
    gender: data.gender,
    deleted_at: data.deleted_at ? moment(data.deleted_at).toDate() : undefined,
    measurement: data.last_measurement,
    age: data.age || 0,
    age_month: data.age_month || 0,
  };
}

export function mappedGender(gender: string) {
  switch (gender) {
    case "l":
      return "Laki-laki";
    case "p":
      return "Perempuan";
    default:
      return "Laki-laki";
  }
}
