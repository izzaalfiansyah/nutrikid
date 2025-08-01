export default defineEventHandler(async (e) => {
  const params = getQuery(e);

  const limit = (params?.limit as number) || 20;
  const page = (params?.page as number) || 1;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const query = (props?: { count?: boolean }) => {
    let q = supabase()
      .from("profiles")
      .select(
        "*",
        props?.count
          ? {
              count: "exact",
              head: true,
            }
          : undefined,
      )
      .order("name", {
        ascending: true,
      })
      .is("deleted_at", null);

    if (params?.search) {
      q = q.ilike("name", `%${params.search}%`);
    }

    if (params?.role) {
      q = q.eq("role", params.role);
    }

    return q;
  };

  const { count: total } = await query({
    count: true,
  });
  const { data, error } = await query().range(from, to);

  if (error) {
    throw new Error("Terjadi kesalahan saat mengambil data pengguna");
  }

  const profiles = data.map((profile) => {
    return profileFromJson({
      ...profile,
    });
  });

  return {
    success: true,
    message: "Berhasil mengambil data pengguna",
    data: {
      total,
      profiles,
    },
  };
});
