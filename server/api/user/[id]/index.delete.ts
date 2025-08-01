import moment from "moment";

export default defineEventHandler(async (e) => {
  const id = e.context.params?.id;

  const { error } = await supabase()
    .from("profiles")
    .update({
      deleted_at: moment().utc().toDate(),
    })
    .eq("id", id);

  if (error) {
    throw new Error("Terjadi kesalahan saat menghapus pengguna");
  }

  return {
    success: true,
    message: "Pengguna berhasil dihapus.",
  };
});
