import { authCheker } from "~~/server/libs/auth-checker";

export default defineEventHandler(async (e) => {
  authCheker(e);

  return {
    success: true,
    message: "Berhasil mengambil profil",
    data: {
      profile: e.context.user as Profile,
    },
  };
});
