import { authMessages } from "@/features/auth/api/errors";
import { env } from "@/lib/env";
import { supabase } from "@/lib/supabase";

export async function requestPasswordReset(email: string) {
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: env.resetPasswordRedirectUrl
  });

  return authMessages.forgotPasswordSuccess;
}
