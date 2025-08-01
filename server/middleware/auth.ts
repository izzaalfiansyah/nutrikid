export default defineEventHandler(async (e) => {
  const authorization = getHeader(e, "Authorization");
  const token = authorization?.replace("Bearer ", "");

  const { data, error } = await supabase().auth.getUser(token);

  if (error) {
    // do nothing
  }

  const profile = await supabase()
    .from("profiles")
    .select("*")
    .eq("user_id", data.user?.id)
    .single();

  if (!profile.data) {
    // do nothing
  }

  if (profile) {
    const data_profile = profileFromJson({
      uuid: data.user?.id,
      email: data.user?.email,
      ...profile.data,
    });

    e.context.user = data_profile;
  }
});
