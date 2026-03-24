import { useRouter } from 'expo-router';

import { ProfileScreenContent } from '@/features/auth/components/profile-screen-content';
import { AUTH_FLOW_ROUTE } from '@/features/auth/utils/route-targets';

export default function ProfileRoute() {
  const router = useRouter();
  return <ProfileScreenContent onSignedOut={() => router.replace(AUTH_FLOW_ROUTE)} />;
}
