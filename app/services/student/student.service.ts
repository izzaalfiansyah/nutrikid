import { supabase } from "~/lib/supabase";
import { studentFromJson, type Student } from "./dto/student.dto";
import type { StudentsParams } from "./dto/students-params.dto";
import moment from "moment";
import { measurementFromJson } from "../measurement/dto/measurement.dto";

export class StudentService {
  static async findAll(params?: StudentsParams) {
    const limit = params?.limit || 20;
    const offset = params?.offset || 1;
    const to = offset + limit - 1;

    let query = supabase()
      .from("students")
      .select("*")
      .range(offset, to)
      .neq("deleted_at", null);

    if (params?.search) {
      query = query.ilike("name", `%${params.search}%`);
    }

    if (params?.male) {
      query = query.eq("male", params.male);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error("Terjadi kesalahan saat mengambil data siswa.");
    }

    const students = data.map((student) => {
      return studentFromJson(student);
    });

    return students;
  }

  static async store(params: Student) {
    const { error } = await supabase().from("students").insert(params);

    if (error) {
      throw new Error("Terjadi kesalahan saat menyimpan data siswa");
    }

    return {
      success: true,
      message: "Data siswa berhasil disimpan",
    };
  }

  static async update(params: Student) {
    const { error } = await supabase()
      .from("students")
      .update(params)
      .eq("id", params.id);

    if (error) {
      throw new Error("Terjadi kesalahan saat menyimpan data siswa");
    }

    return {
      success: true,
      message: "Data siswa berhasil disimpan",
    };
  }

  static async destroy(params: Student) {
    const { error } = await supabase()
      .from("students")
      .update({
        deleted_at: moment().utc().toDate(),
      })
      .eq("id", params.id);

    if (error) {
      throw new Error("Terjadi kesalahan saat menghapus data siswa");
    }

    return {
      success: true,
      message: "Data siswa berhasil dihapus",
    };
  }

  static async histories(params: Student) {
    const { data, error } = await supabase()
      .from("measurements")
      .select("*")
      .eq("student_id", params.id)
      .neq("deleted_at", null);

    if (error) {
      throw new Error("Terjadi kesalahan saat mengambil riwayat data siswa");
    }

    return data.map((measurement) => measurementFromJson(measurement));
  }
}
