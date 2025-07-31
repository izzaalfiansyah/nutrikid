import { supabase } from "~/lib/supabase";
import { measurementFromJson, type Measurement } from "./dto/measurement.dto";
import type { MeasurementParams } from "./dto/measurement-params.dto";
import { calculateBmi } from "~/lib/calculate-bmi";
import { calculateAge } from "~/lib/calculate-age";
import moment from "moment";

export class MeasurementService {
  static async findAll(params?: MeasurementParams) {
    const limit = params?.limit || 20;
    const page = params?.page || 1;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase()
      .from("measurements")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .is("deleted_at", null);

    if (params?.start_date) {
      query = query.gte("created_at", params.start_date);
    }

    if (params?.end_date) {
      query = query.lte("created_at", params.end_date);
    }

    if (params?.student_id) {
      query = query.eq("student_id", params.student_id);
    }

    const total = (await query).count;
    const { data, error } = await query.range(from, to);

    if (error) {
      throw new Error("Terjadi kesalahan saat mengambil data pengukuran");
    }

    const { data: students, error: studentsError } = await supabase()
      .from("students")
      .select("*")
      .in(
        "id",
        data.map((item) => item.student_id),
      );

    if (studentsError) {
      throw new Error("Terjadi kesalahan saat mengambil data relasi siswa");
    }

    const measurements = data.map((measurement) => {
      measurement.student = students?.find(
        (student) => student.id == measurement.student_id,
      );

      return measurementFromJson(measurement);
    });

    return {
      total,
      measurements,
    };
  }

  static async show(id: number) {
    const { data, error } = await supabase()
      .from("measurements")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error("Data pengukuran tidak ditemukan");
    }

    const { data: student, error: errorStudent } = await supabase()
      .from("students")
      .select("*")
      .eq("id", data.student_id)
      .single();

    if (error) {
      throw new Error("Terjadi kesalahan saat mengambil data pengukuran");
    }

    data.student = student;

    const measurement = measurementFromJson(data);

    return {
      measurement,
    };
  }

  static async store(params: Measurement) {
    const age = calculateAge(
      params.student?.birth_date || moment().utc().toDate(),
    );

    const result = calculateBmi(age, {
      height: params.student_height,
      weight: params.student_weight,
    });

    if (params.student) {
      params.student_id = params.student.id;
    }

    const authStore = useAuthStore();

    const { error } = await supabase().from("measurements").insert({
      student_id: params.student_id,
      student_weight: params.student_weight,
      student_height: params.student_height,
      student_age: age,
      student_bmi: result.bmi,
      creator_id: authStore.user?.id,
    });

    if (error) {
      throw new Error("Terjadi kesalahan saat menyimpan data pengukuran");
    }

    return {
      success: true,
      message: "Data pengukuran berhasil disimpan",
    };
  }

  static async update(params: Measurement) {
    const age = calculateAge(
      params.student?.birth_date || moment().utc().toDate(),
    );

    const result = calculateBmi(age, {
      height: params.student_height,
      weight: params.student_weight,
    });

    if (params.student) {
      params.student_id = params.student.id;
    }

    const authStore = useAuthStore();

    const { error } = await supabase()
      .from("measurements")
      .update({
        student_id: params.student_id,
        student_weight: params.student_weight,
        student_height: params.student_height,
        student_age: age,
        student_bmi: result.bmi,
        creator_id: authStore.user?.id,
      })
      .neq("id", params.id);

    if (error) {
      throw new Error("Terjadi kesalahan saat menyimpan data pengukuran");
    }

    return {
      success: true,
      message: "Data pengukuran berhasil disimpan",
    };
  }

  static async destroy(params: Measurement) {
    const { error } = await supabase()
      .from("measurements")
      .update({
        deleted_at: moment().utc().toDate(),
      })
      .eq("id", params.id);

    if (error) {
      throw new Error("Terjadi kesalahan saat menghapus data pengukuran");
    }

    return {
      success: true,
      message: "Data pengukuran berhasil dihapus",
    };
  }
}
