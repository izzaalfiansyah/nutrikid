export default defineEventHandler(async (e) => {
  const id = e.context.params?.id;

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
    success: true,
    message: "Berhasil mengambil data pengukuran",
    data: {
      measurement,
    },
  };
});
