import { Redirect, Stack } from 'expo-router';

import { BootstrapScreen } from '@/components/ui/bootstrap-screen';
import { AUTH_FLOW_ROUTE, resolveProtectedRouteTarget } from '@/features/auth/utils/route-targets';
import { useAuthContext } from '@/providers/app-providers';

export default function ProtectedLayout() {
  const { isHydrating, user } = useAuthContext();
  const target = resolveProtectedRouteTarget({
    isAuthenticated: Boolean(user),
    isHydrating,
  });

  if (target === 'bootstrap') {
    return <BootstrapScreen />;
  }

  if (target) {
    return <Redirect href={AUTH_FLOW_ROUTE} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
