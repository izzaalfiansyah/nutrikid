export function throwError(err: any) {
  const errorMessage =
    err?.response?.data?.message || err?.message || "Terjadi kesalahan";
  throw new Error(errorMessage);
}
