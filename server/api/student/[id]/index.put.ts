export default defineEventHandler(async (e) => {
  const id = e.context.params?.id;
  const params = await readBody(e);

  if (params.parent) {
    params.parent_id = params.parent.id;
  }

  const { error } = await supabase()
    .from("students")
    .update(params)
    .eq("id", id);

  if (error) {
    throw new Error("Terjadi kesalahan saat menyimpan data siswa");
  }

  return {
    success: true,
    message: "Data siswa berhasil disimpan",
  };
});
