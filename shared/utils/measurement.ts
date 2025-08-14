import moment from "moment";
import type { Student } from "./student";
import type { Profile } from "./profile";

export type MeasurementStatus =
  | "emaciated"
  | "thinnes"
  | "normal"
  | "overweight"
  | "obese";

export interface Measurement {
  id: number;
  student_id?: number;
  student?: Student;
  student_age: number;
  student_age_month: number;
  student_age_month_total: number;
  student_weight: number;
  student_height: number;
  student_bmi: number;
  status?: MeasurementStatus;
  z_score?: number;
  creator_id?: number;
  creator?: Profile;
  created_at: Date;
  suggestion_advices: Array<string>;
  deleted_at?: Date;
}

export function measurementFromJson(data: any): Measurement {
  return {
    id: data.id,
    student_id: data.student_id,
    student: data.student,
    student_age: data.student_age,
    student_age_month: data.student_age_month,
    student_age_month_total: data.student_age_month_total,
    student_weight: data.student_weight,
    student_height: data.student_height,
    student_bmi: data.student_bmi,
    created_at: moment(data.created_at).toDate(),
    deleted_at: data.deleted_at ? moment(data.deleted_at).toDate() : undefined,
    status: data.status,
    suggestion_advices: data.suggestion_advices || [],
    z_score: data.z_score,
  };
}

export function mappedMeasurementStatus(status: MeasurementStatus) {
  return {
    emaciated: "Gizi Buruk",
    thinnes: "Gizi Kurang",
    normal: "Gizi Baik",
    overweight: "Gizi Lebih",
    obese: "Obesitas",
  }[status];
}
