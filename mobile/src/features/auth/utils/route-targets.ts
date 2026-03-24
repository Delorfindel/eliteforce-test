export const AUTH_FLOW_ROUTE = '/login';
export const APP_SHELL_ROUTE = '/(app)/(tabs)';

export function resolveIndexRouteTarget({
  isHydrating,
  isAuthenticated,
}: {
  isAuthenticated: boolean;
  isHydrating: boolean;
}) {
  if (isHydrating) {
    return 'bootstrap' as const;
  }

  return isAuthenticated ? APP_SHELL_ROUTE : AUTH_FLOW_ROUTE;
}

export function resolveProtectedRouteTarget({
  isHydrating,
  isAuthenticated,
}: {
  isAuthenticated: boolean;
  isHydrating: boolean;
}) {
  if (isHydrating) {
    return 'bootstrap' as const;
  }

  return isAuthenticated ? null : AUTH_FLOW_ROUTE;
}
