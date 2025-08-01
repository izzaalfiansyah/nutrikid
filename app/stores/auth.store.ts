import { defineStore } from "pinia";
import { AuthService } from "~/services/auth/auth.service";

export const useAuthStore = defineStore("auth", {
  state(): {
    user: Profile | null;
    isAdmin: boolean;
  } {
    return {
      user: null,
      isAdmin: false,
    };
  },
  actions: {
    setUser(user: Profile | null) {
      this.user = user;
      this.isAdmin = user?.role == "admin";
    },
    async logout() {
      this.user = null;
      this.isAdmin = false;
      await AuthService.logout();

      navigateTo("/login");
    },
  },
});
