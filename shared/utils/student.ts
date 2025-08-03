import moment from "moment";
import type { Profile } from "./profile";
import type { Measurement } from "./measurement";
import { calculateAge } from "./calculate-age";

export type Gender = "l" | "p";

export interface Student {
  id: number;
  name: string;
  birth_date: Date;
  gender: Gender;
  parent_id?: number;
  parent?: Profile;
  deleted_at?: Date;
  age: number;
  last_measurement?: Measurement;
}

export function studentFromJson(data: any): Student {
  const age = calculateAge(data.birth_date);

  return {
    id: data.id,
    name: data.name,
    birth_date: moment(data.birth_date).toDate(),
    gender: data.gender,
    parent_id: data.parent_id,
    parent: data.parent,
    deleted_at: data.deleted_at ? moment(data.deleted_at).toDate() : undefined,
    last_measurement: data.last_measurement,
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
