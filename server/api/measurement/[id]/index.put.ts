import moment from "moment";

export default defineEventHandler(async (e) => {
  const params = await readBody(e);
  const id = e.context.params?.id;

  const age = calculateAge(
    params?.student?.birth_date || moment().utc().toDate(),
  );

  const result = calculateBmi(age, {
    height: params?.student_height,
    weight: params?.student_weight,
  });

  if (params.student) {
    params.student_id = params.student.id;
  }

  const creator_id = e.context.user?.id;

  const { error } = await supabase()
    .from("measurements")
    .update({
      student_id: params?.student_id,
      student_weight: params?.student_weight,
      student_height: params?.student_height,
      student_age: age,
      student_bmi: result.bmi,
      creator_id,
    })
    .neq("id", id);

  if (error) {
    throw new Error("Terjadi kesalahan saat menyimpan data pengukuran");
  }

  return {
    success: true,
    message: "Data pengukuran berhasil disimpan",
  };
});
