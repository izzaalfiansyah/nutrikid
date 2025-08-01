export default defineEventHandler(async (e) => {
  const id = e.context.params?.id;

  const params = await readBody(e);
  const creator_id = e.context.user?.id;

  console.log(creator_id);
  console.log(params);

  const { error } = await supabase().from("measurement_suggestions").insert({
    measurement_id: id,
    creator_id,
    advice: params.advice,
  });

  if (error) {
    throw new Error("Terjadi kesalahan saat menyimpan saran pengukuran");
  }

  return {
    success: true,
    message: "Saran pengukuran berhasil disimpan",
  };
});
