import { authCheker } from "~~/server/libs/auth-checker";
import { Profile } from "~~/shared/utils/profile";

export default defineEventHandler(async (e) => {
  authCheker(e);

  return {
    success: true,
    message: "Profile retrieved",
    data: {
      profile: e.context.user as Profile,
    },
  };
});
