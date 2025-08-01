export default defineEventHandler(async (e) => {
  const measurement_id = e.context.params?.id;

  const { data: suggestions, error } = await supabase()
    .from("measurement_suggestions")
    .select("*")
    .eq("measurement_id", measurement_id);

  const { data: creators } = await supabase()
    .from("profiles")
    .select("*")
    .in(
      "id",
      (suggestions || []).map((suggestion) => suggestion.creator_id),
    );

  if (error) {
    throw new Error("Terjadi kesalahan saat mengambil data saran pengukuran");
  }

  const data_suggestion = suggestions.map((suggestion) => {
    suggestion.creator = (creators || []).find(
      (creator) => creator.id == suggestion.creator_id,
    );
    return suggestion;
  });

  return {
    success: true,
    message: "Berhasil mengambil data saran pengukuran",
    data: {
      suggestions: data_suggestion,
    },
  };
});
