import { authMessages, normalizeAuthError } from '@/features/auth/api/errors';
import type { RegisterFormValues } from '@/features/auth/schemas/register-schema';
import { supabase } from '@/lib/supabase';

async function waitForProfile(userId: string) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data) {
      return data;
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  return null;
}

export async function signUp(input: RegisterFormValues) {
  const acceptedTermsAt = new Date().toISOString();

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        accepted_terms_at: acceptedTermsAt,
        first_name: input.firstName,
        last_name: input.lastName,
        phone: input.phone,
      },
    },
  });

  if (error) {
    throw new Error(normalizeAuthError(error));
  }

  if (!data.user || !data.session) {
    throw new Error(authMessages.provisioningError);
  }

  const profile = await waitForProfile(data.user.id);

  if (!profile) {
    await supabase.auth.signOut();
    throw new Error(authMessages.provisioningError);
  }

  return {
    profile,
    session: data.session,
    user: data.user,
  };
}
