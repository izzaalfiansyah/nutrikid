import { authChecker } from "~~/server/libs/auth-checker";

export default defineEventHandler(async (e) => {
  authChecker(e);

  return {
    success: true,
    message: "Berhasil mengambil profil",
    data: {
      profile: e.context.user as Profile,
    },
  };
});
