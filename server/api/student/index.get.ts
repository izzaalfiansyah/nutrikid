export default defineEventHandler(async (e) => {
  const params = getQuery(e);

  const limit = (params?.limit || 20) as number;
  const page = (params?.page || 1) as number;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const query = (props?: { count?: boolean }) => {
    let q = supabase()
      .from("students")
      .select("*", props?.count ? { count: "exact", head: true } : undefined)
      .is("deleted_at", null);

    if (params?.search) {
      q = q.ilike("name", `%${params.search}%`);
    }

    if (params?.gender) {
      q = q.eq("gender", params.gender);
    }

    return q;
  };

  const { count: total } = await query({ count: true });
  const { data, error } = await query().range(from, to);

  if (error) {
    throw new Error("Terjadi kesalahan saat mengambil data siswa.");
  }

  const students = data.map((student) => {
    return studentFromJson(student);
  });

  return {
    success: true,
    message: "Berhasil mengambil data siswa",
    data: {
      total,
      students,
    },
  };
});
