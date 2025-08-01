export default defineEventHandler(async (e) => {
  const params = await readBody(e);

  if (e.context.user.user_id != params.uuid && e.context.user.role != "admin") {
    throw new Error("Anda tidak memiliki akses untuk mengubah password ini");
  }

  const { error } = await supabase().auth.admin.updateUserById(params.uuid, {
    password: params.password,
  });

  if (error) {
    throw new Error("Gagal mengubah password pengguna.");
  }

  return {
    success: true,
    message: "Password pengguna berhasil diubah.",
  };
});
