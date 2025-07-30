import moment from "moment";
import { calculateStatus } from "~/lib/calculate-status";
import { calculateZScore } from "~/lib/calculate-zscore";
import type { Student } from "~/services/student/dto/student.dto";

export type MeasurementStatus = "wasted" | "normal" | "overweight" | "obese";

export interface Measurement {
  id: number;
  student_id: number;
  student?: Student;
  student_age: number;
  student_weight: number;
  student_height: number;
  student_bmi: string;
  status?: MeasurementStatus;
  z_score?: number;
  created_at: Date;
  deleted_at?: Date;
}

export function measurementFromJson(data: any): Measurement {
  const z_score = calculateZScore(data.student_bmi, data.student_age);
  const status = calculateStatus(z_score);

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
    status,
    z_score,
  };
}
