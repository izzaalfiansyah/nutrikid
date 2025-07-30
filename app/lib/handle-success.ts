import { toast } from "vue-sonner";

export function handleSuccess(message: string) {
  toast("Sukses!", {
    description: message,
    position: "bottom-right",
  });
}
