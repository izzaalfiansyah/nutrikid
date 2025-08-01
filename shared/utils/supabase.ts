import { createClient } from "@supabase/supabase-js";

export const supabase = () => {
  let supabaseUrl: any = process.env.SUPABASE_URL || "";
  let supabaseKey: any = process.env.SUPABASE_KEY || "";

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase credentials");
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });
};
