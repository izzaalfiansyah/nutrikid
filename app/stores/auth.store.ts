import { defineStore } from "pinia";
import { AuthService } from "~/services/auth/auth.service";
import type { Profile } from "~/services/auth/dto/profile.dto";

export const useAuthStore = defineStore("auth", {
  state(): {
    user: Profile | null;
  } {
    return {
      user: null,
    };
  },
  actions: {
    setUser(user: Profile | null) {
      this.user = user;
    },
    async logout() {
      const router = useRouter();

      this.user = null;
      await AuthService.logout();

      navigateTo("/login");
    },
  },
});
