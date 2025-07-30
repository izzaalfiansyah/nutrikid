import { toast } from "vue-sonner";

export function handleError(error: any) {
  toast("Gagal!", {
    description: error?.message || error || "Terjadi kesalahan",
    class: "bg-red-500 text-white",
    position: "bottom-center",
  });
}
