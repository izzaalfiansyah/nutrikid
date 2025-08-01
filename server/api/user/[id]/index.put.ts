export default defineEventHandler(async (e) => {
  const id = e.context.params?.id;
  const params = await readBody(e);

  const { error } = await supabase()
    .from("profiles")
    .update({
      name: params?.name,
      phone: params?.phone,
      role: params?.role,
    })
    .eq("id", id);

  if (error) {
    throw new Error("Terjadi kesalahan saat mengedit profil pengguna");
  }

  return {
    success: true,
    message: "Pengguna berhasil diedit",
  };
});
