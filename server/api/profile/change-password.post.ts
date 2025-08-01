export default defineEventHandler(async (e) => {
  const params = await readBody(e);

  if (params.password != params.password_confirmation) {
    throw new Error("Password baru tidak sama dengan konfirmasi password.");
  }

  const { data, error } = await supabase().auth.admin.updateUserById(
    e.context.user.user_id,
    {
      password: params.password,
    },
  );

  if (error) {
    throw new Error("Gagal mengubah password.");
  }

  return {
    success: true,
    message: "Password berhasil diubah",
  };
});
