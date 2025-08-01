import moment from "moment";

export default defineEventHandler(async (e) => {
  const id = e.context.params?.id;

  const { error } = await supabase()
    .from("measurements")
    .update({
      deleted_at: moment().utc().toDate(),
    })
    .eq("id", id);

  if (error) {
    throw new Error("Terjadi kesalahan saat menghapus data pengukuran");
  }

  return {
    success: true,
    message: "Data pengukuran berhasil dihapus",
  };
});
