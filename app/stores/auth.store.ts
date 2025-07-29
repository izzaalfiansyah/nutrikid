import { defineStore } from "pinia";
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
  },
});
