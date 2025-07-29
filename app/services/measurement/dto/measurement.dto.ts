import type { Student } from "~/services/student/dto/student.dto";

export interface Measurement {
  id: number;
  student_id: number;
  student?: Student;
  student_age: number;
  student_weight: number;
  student_height: number;
  student_bmi: string;
  status: "normal" | "fat" | "thin" | "obese";
  created_at: Date;
  deleted_at?: Date;
}
