import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/providers/app-providers';
import type { Database } from '@/types/database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

async function getProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as ProfileRow | null;
}

export function useAuthSession() {
  const auth = useAuthContext();

  const profileQuery = useQuery<ProfileRow | null>({
    enabled: Boolean(auth.user?.id),
    queryFn: () => (auth.user?.id ? getProfile(auth.user.id) : Promise.resolve(null)),
    queryKey: ['profile', auth.user?.id],
  });

  return {
    ...auth,
    isAuthenticated: Boolean(auth.user),
    isProfileLoading: profileQuery.isLoading,
    profile: profileQuery.data ?? null,
    refetchProfile: profileQuery.refetch,
  };
}
