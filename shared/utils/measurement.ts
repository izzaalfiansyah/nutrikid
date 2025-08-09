import moment from "moment";
import type { Student } from "./student";
import type { Profile } from "./profile";

export type MeasurementStatus = "thinnes" | "normal" | "overweight" | "obese";

export interface Measurement {
  id: number;
  student_id?: number;
  student?: Student;
  student_age: number;
  student_weight: number;
  student_height: number;
  student_bmi: number;
  status?: MeasurementStatus;
  z_score?: number;
  creator_id?: number;
  creator?: Profile;
  created_at: Date;
  deleted_at?: Date;
}

export function measurementFromJson(data: any): Measurement {
  return {
    id: data.id,
    student_id: data.student_id,
    student: data.student,
    student_age: data.student_age,
    student_weight: data.student_weight,
    student_height: data.student_height,
    student_bmi: data.student_bmi,
    created_at: moment(data.created_at).toDate(),
    deleted_at: data.deleted_at ? moment(data.deleted_at).toDate() : undefined,
    status: data.status,
    z_score: data.z_score,
  };
}

export function mappedMeasurementStatus(status: MeasurementStatus) {
  return {
    thinnes: "Gizi Kurang",
    normal: "Gizi Baik",
    overweight: "Gizi Lebih",
    obese: "Obesitas",
  }[status];
}
