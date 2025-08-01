export default defineEventHandler(async (e) => {
  const params = await readBody(e);

  const { data, error } = await supabase().auth.admin.createUser({
    email: params?.email,
    password: params?.password,
    email_confirm: true,
  });

  if (error) {
    throw new Error("Terjadi kesalahan saat membuat pengguna baru");
  }

  const { error: profileError } = await supabase().from("profiles").insert({
    name: params?.name,
    user_id: data?.user?.id,
    phone: params?.phone,
    role: params?.role,
  });

  if (profileError) {
    throw new Error("Terjadi kesalahan saat membuat profil pengguna baru");
  }

  return {
    success: true,
    message: "Pengguna baru berhasil ditambahkan",
  };
});
