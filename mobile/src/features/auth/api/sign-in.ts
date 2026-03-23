import { normalizeAuthError } from "@/features/auth/api/errors";
import { supabase } from "@/lib/supabase";

type SignInInput = {
  email: string;
  password: string;
};

export async function signIn(input: SignInInput) {
  const { data, error } = await supabase.auth.signInWithPassword(input);

  if (error) {
    throw new Error(normalizeAuthError(error));
  }

  return data;
}
