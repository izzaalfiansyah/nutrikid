import { Mars, Venus } from "lucide-vue-next";

export function genderIcon(gender: string) {
  switch (gender) {
    case "l":
      return Mars;
    case "p":
      return Venus;
    default:
      return Mars;
  }
}
