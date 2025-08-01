export default defineEventHandler(async (e) => {
  const authorization = getHeader(e, "Authorization");
  const token = authorization?.replace("Bearer ", "");

  const { data, error } = await supabase().auth.getUser(token);

  if (error) {
    // do nothing
  }

  const { data: profile } = await supabase()
    .from("profiles")
    .select("*")
    .eq("user_id", data.user?.id)
    .limit(1)
    .single();

  if (profile) {
    const data_profile = profileFromJson({
      uuid: data.user?.id,
      email: data.user?.email,
      ...profile,
    });

    e.context.user = data_profile;
  } else {
    e.context.user = undefined;
  }
});
