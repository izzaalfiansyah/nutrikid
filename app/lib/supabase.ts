import { createClient } from "@supabase/supabase-js";

export const supabase = () => {
  const config = useRuntimeConfig();

  const supabaseUrl: any = config.public.SUPABASE_URL || "";
  const supabaseKey: any = config.public.SUPABASE_KEY || "";

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase credentials");
  }

  return createClient(supabaseUrl, supabaseKey);
};
