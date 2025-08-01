import type { StudentsParams } from "./dto/students-params.dto";
import { throwError } from "~/lib/throw-error";
import { http } from "~/lib/axios";

export class StudentService {
  static async findAll(params?: StudentsParams) {
    try {
      const res = await http().get("/student", {
        params: params,
      });

      return res.data.data;
    } catch (err) {
      throwError(err);
    }
  }

  static async store(params: Student) {
    try {
      const res = await http().post("/student", params);

      return res.data;
    } catch (err) {
      throwError(err);
    }
  }

  static async update(params: Student) {
    try {
      const res = await http().put("/student/" + params.id, params);

      return res.data;
    } catch (err) {
      throwError(err);
    }
  }

  static async destroy(params: Student) {
    try {
      const res = await http().delete("/student/" + params.id);

      return res.data;
    } catch (err) {
      throwError(err);
    }
  }

  static async lastStatistic(params: Student | number) {
    const id = typeof params == "object" ? params.id : params;

    try {
      const res = await http().get("/student/" + id);

      return res.data.data.student;
    } catch (err) {
      throwError(err);
    }
  }

  static async statistics(params: Student | number) {
    const id = typeof params == "object" ? params.id : params;

    const { data, error } = await supabase()
      .from("measurements")
      .select("*")
      .eq("student_id", id)
      .range(0, 20)
      .order("created_at", {
        ascending: false,
      })
      .is("deleted_at", null);

    const { data: dataStudent, error: errorStudent } = await supabase()
      .from("students")
      .select("*")
      .eq("id", id)
      .single();

    if (error || errorStudent) {
      throw new Error("Terjadi kesalahan saat mengambil riwayat data siswa");
    }

    const student = studentFromJson(dataStudent);

    const measurements = data
      .map((measurement) => {
        return measurementFromJson(measurement);
      })
      .reverse();

    return {
      measurements,
      student,
    };
  }
}
