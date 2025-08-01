export default defineEventHandler(async (e) => {
  const params = await readBody(e);

  const { error } = await supabase()
    .from("profiles")
    .update({
      name: params.name,
      phone: params.phone,
    })
    .eq("id", params.id);

  if (error) {
    throw new Error("Gagal mengubah profil.");
  }

  return {
    success: true,
    message: "Profil berhasil diubah",
  };
});
