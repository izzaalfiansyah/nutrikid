import type { MeasurementParams } from "./dto/measurement-params.dto";
import { calculateBmi } from "~/lib/calculate-bmi";
import { calculateAge } from "~/lib/calculate-age";
import moment from "moment";
import { throwError } from "~/lib/throw-error";
import { http } from "~/lib/axios";

export class MeasurementService {
  static async findAll(params?: MeasurementParams) {
    try {
      const res = await http().get("/measurement", {
        params,
      });

      return res.data.data;
    } catch (err) {
      throwError(err);
    }
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
