import { supabase } from "~/lib/supabase";
import { measurementFromJson, type Measurement } from "./dto/measurement.dto";
import type { MeasurementParams } from "./dto/measurement-params.dto";
import { calculateBmi } from "~/lib/calculate-bmi";
import { calculateAge } from "~/lib/calculate-age";
import moment from "moment";

export class MeasurementService {
  static async findAll(params?: MeasurementParams) {
    const limit = params?.limit || 20;
    const offset = params?.offset || 1;
    const to = offset + limit - 1;

    let query = supabase()
      .from("measurements")
      .select("*")
      .range(offset, to)
      .neq("deleted_at", null);

    if (params?.start_date) {
      query = query.gte("created_at", params.start_date);
    }

    if (params?.end_date) {
      query = query.lte("created_at", params.end_date);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error("Terjadi kesalahan saat mengambil data pengukuran");
    }

    return data.map((measurement) => measurementFromJson(measurement));
  }

  static async store(params: Measurement) {
    const age = calculateAge(
      params.student?.birth_date || moment().utc().toDate(),
    );

    const bmi = calculateBmi(age, {
      height: params.student_height,
      weight: params.student_weight,
    });

    const authStore = useAuthStore();

    const { error } = await supabase().from("measurements").insert({
      student_id: params.student_id,
      student_weight: params.student_weight,
      student_height: params.student_height,
      student_age: age,
      student_bmi: bmi,
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

    const bmi = calculateBmi(age, {
      height: params.student_height,
      weight: params.student_weight,
    });

    const authStore = useAuthStore();

    const { error } = await supabase()
      .from("measurements")
      .update({
        student_id: params.student_id,
        student_weight: params.student_weight,
        student_height: params.student_height,
        student_age: age,
        student_bmi: bmi,
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
