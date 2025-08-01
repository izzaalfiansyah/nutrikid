import moment from "moment";

export default defineEventHandler(async (e) => {
  const params = getQuery(e);

  const limit = (params?.limit || 20) as number;
  const page = (params?.page || 1) as number;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  let student_ids = [];

  if (e.context.user?.role == "parent") {
    params.parent_id = e.context.user?.id;
  }

  if (params.parent_id) {
    const { data: students } = await supabase()
      .from("students")
      .select("id")
      .eq("parent_id", params.parent_id);

    student_ids = students?.map((student) => student.id) || [];
  }

  console.log(params.parent_id, student_ids);

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

    if (params?.parent_id) {
      q = q.in("student_id", student_ids);
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
