import { supabase } from "@/lib/supabase";

export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    throw error;
  }

  return data;
}
