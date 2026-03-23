import { Redirect, Stack } from "expo-router";
import React from "react";

import { BootstrapScreen } from "@/components/ui/bootstrap-screen";
import { useAuthContext } from "@/providers/app-providers";
import {
  AUTH_FLOW_ROUTE,
  resolveProtectedRouteTarget
} from "@/features/auth/utils/route-targets";

export default function ProtectedLayout() {
  const { isHydrating, user } = useAuthContext();
  const target = resolveProtectedRouteTarget({
    isAuthenticated: Boolean(user),
    isHydrating
  });

  if (target === "bootstrap") {
    return <BootstrapScreen />;
  }

  if (target) {
    return <Redirect href={AUTH_FLOW_ROUTE} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    />
  );
}
