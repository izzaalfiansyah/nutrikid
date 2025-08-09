import moment from "moment";
import type { Measurement } from "./measurement";
import { calculateAge } from "./calculate-age";

export type Gender = "l" | "p";

export interface Student {
  id: number;
  nisn: string;
  name: string;
  birth_date: Date;
  gender: Gender;
  deleted_at?: Date;
  age: number;
  school_id?: number;
  school?: School;
  measurement?: Measurement;
}

export function studentFromJson(data: any): Student {
  const age = calculateAge(data.birth_date);

  return {
    id: data.id,
    nisn: data.nisn,
    name: data.name,
    birth_date: moment(data.birth_date).toDate(),
    gender: data.gender,
    deleted_at: data.deleted_at ? moment(data.deleted_at).toDate() : undefined,
    measurement: data.last_measurement,
    age: age || 0,
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
