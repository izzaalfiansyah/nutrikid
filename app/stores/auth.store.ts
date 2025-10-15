import { defineStore } from "pinia";
import { AuthService } from "~/services/auth/auth.service";

export const useAuthStore = defineStore("auth", {
  state(): {
    user: Profile | null;
    isAdmin: boolean;
    isParent: boolean;
  } {
    return {
      user: null,
      isAdmin: false,
      isParent: false,
    };
  },
  actions: {
    setUser(user: Profile | null) {
      this.user = user;
      this.isAdmin = user?.role == "admin" || user?.role == "superadmin";
      this.isParent = user?.role == "parent";
    },
    async logout() {
      this.setUser(null);
      await AuthService.logout();

      navigateTo("/login");
    },
  },
});
