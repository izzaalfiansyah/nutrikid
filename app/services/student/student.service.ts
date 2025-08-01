import { supabase } from "~/lib/supabase";
import { studentFromJson, type Student } from "./dto/student.dto";
import type { StudentsParams } from "./dto/students-params.dto";
import moment from "moment";
import { measurementFromJson } from "../measurement/dto/measurement.dto";

export class StudentService {
  static async findAll(params?: StudentsParams) {
    const limit = params?.limit || 20;
    const page = params?.page || 1;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const query = (props?: { count?: boolean }) => {
      let q = supabase()
        .from("students")
        .select("*", props?.count ? { count: "exact", head: true } : undefined)
        .is("deleted_at", null);

      if (params?.search) {
        q = q.ilike("name", `%${params.search}%`);
      }

      if (params?.gender) {
        q = q.eq("gender", params.gender);
      }

      return q;
    };

    const { count: total } = await query({ count: true });
    const { data, error } = await query().range(from, to);

    if (error) {
      throw new Error("Terjadi kesalahan saat mengambil data siswa.");
    }

    const students = data.map((student) => {
      return studentFromJson(student);
    });

    return {
      total,
      students,
    };
  }

  static async store(params: Student) {
    if (params.parent) {
      params.parent_id = params.parent.id;
    }

    params.id = undefined as any;

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
    if (params.parent) {
      params.parent_id = params.parent.id;
    }

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

  static async lastStatistic(params: Student | number) {
    const id = typeof params == "object" ? params.id : params;

    const { data, error } = await supabase()
      .from("measurements")
      .select("*")
      .eq("student_id", id)
      .order("created_at", {
        ascending: false,
      })
      .single();

    if (error || !data) {
      throw new Error("Terjadi kesalahan saat mengambil data");
    }

    const measurement = measurementFromJson(data);

    return {
      measurement,
    };
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
