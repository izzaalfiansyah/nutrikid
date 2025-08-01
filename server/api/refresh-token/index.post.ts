export default defineEventHandler(async (e) => {
  const params = await readBody(e);

  const refresh_token = params.refresh_token as string;
  const access_token = params.access_token as string;

  const { data, error } = await supabase().auth.setSession({
    refresh_token,
    access_token,
  });

  if (error) {
    throw new Error("Gagal memperbarui access token");
  }

  return {
    success: true,
    message: "Access token berhasil diperbarui",
    data: {
      refresh_token: data.session?.refresh_token,
      access_token: data.session?.access_token,
    },
  };
});
