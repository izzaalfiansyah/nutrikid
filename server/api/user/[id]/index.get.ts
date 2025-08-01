export default defineEventHandler(async (e) => {
  const id = (e.context.params?.id || 0) as number;

  const { data: profile, error: errorProfile } = await supabase()
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (errorProfile || !profile) {
    throw new Error("User tidak ditemukan");
  }

  const { data, error } = await supabase().auth.admin.getUserById(
    profile.user_id,
  );

  if (error) {
    throw new Error("Gagal mengambil data pengguna");
  }

  const profileData = profileFromJson({
    ...profile,
    email: data.user.email,
  });

  return {
    success: true,
    message: "Berhasil mengambil data pengguna",
    data: {
      user: profileData,
    },
  };
});
