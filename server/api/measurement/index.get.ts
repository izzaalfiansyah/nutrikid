import moment from "moment";

export default defineEventHandler(async (e) => {
  const params = getQuery(e);

  const limit = (params?.limit || 20) as number;
  const page = (params?.page || 1) as number;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const query = (props?: { count?: boolean }) => {
    let q = supabase()
      .from("measurements")
      .select(
        "*",
        props?.count
          ? {
              count: "exact",
              head: true,
            }
          : undefined,
      )
      .order("created_at", {
        ascending: false,
      })
      .is("deleted_at", null);

    if (params?.start_date) {
      q = q.gte(
        "created_at",
        moment(params?.start_date as any).format("YYYY-MM-DD"),
      );
    }

    if (params?.end_date) {
      q = q.lte(
        "created_at",
        moment(params?.end_date as any).format("YYYY-MM-DD"),
      );
    }

    if (params?.student_id) {
      q = q.eq("student_id", params.student_id);
    }

    return q;
  };

  const { count: total } = await query({
    count: true,
  });
  const { data, error } = await query().range(from, to);

  if (error) {
    throw new Error("Terjadi kesalahan saat mengambil data pengukuran");
  }

  const { data: students, error: studentsError } = await supabase()
    .from("students")
    .select("*")
    .in(
      "id",
      data.map((item) => item.student_id),
    );

  if (studentsError) {
    throw new Error("Terjadi kesalahan saat mengambil data relasi siswa");
  }

  const measurements = data.map((measurement) => {
    measurement.student = students?.find(
      (student) => student.id == measurement.student_id,
    );

    return measurementFromJson(measurement);
  });

  return {
    success: true,
    message: "Berhasil mengambil data pengukuran",
    data: {
      total,
      measurements,
    },
  };
});
