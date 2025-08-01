export default defineEventHandler(async (e) => {
  const params = await readBody(e);

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
});
