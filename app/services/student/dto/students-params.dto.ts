import type { Gender } from "./student.dto";

export interface StudentsParams {
  limit?: number;
  page?: number;
  search?: string;
  gender?: Gender;
}
