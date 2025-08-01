import { defineStore } from "pinia";
import { AuthService } from "~/services/auth/auth.service";

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
      this.user = null;
      await AuthService.logout();

      navigateTo("/login");
    },
  },
});
