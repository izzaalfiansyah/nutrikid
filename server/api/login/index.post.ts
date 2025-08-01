import { supabase } from "#shared/utils/supabase";

export default defineEventHandler(async (e) => {
  const params = await readBody(e);

  const { data, error } = await supabase().auth.signInWithPassword({
    email: params.email,
    password: params.password,
  });

  if (error) {
    throw new Error("Username atau password salah.");
  }

  return {
    success: true,
    message: "Login berhasil",
    data: {
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
    },
  };
});
