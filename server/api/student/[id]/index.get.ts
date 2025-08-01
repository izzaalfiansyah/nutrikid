export default defineEventHandler(async (e) => {
  const id = e.context.params?.id;

  const { data: student, error: errorStudent } = await supabase()
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  if (errorStudent || !student) {
    throw new Error("Terjadi kesalahan saat mengambil data");
  }

  const { data: measurement, error } = await supabase()
    .from("measurements")
    .select("*")
    .eq("student_id", student.id)
    .is("deleted_at", null)
    .order("created_at", {
      ascending: false,
    })
    .single();

  if (measurement) {
    student.measurement = measurementFromJson(measurement);
  }

  return {
    success: true,
    message: "Berhasil mengambil data siswa",
    data: {
      student,
    },
  };
});
