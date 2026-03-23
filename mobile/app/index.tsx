import { Redirect } from "expo-router";
import React from "react";

import { BootstrapScreen } from "@/components/ui/bootstrap-screen";
import { useAuthContext } from "@/providers/app-providers";
import {
  APP_SHELL_ROUTE,
  AUTH_FLOW_ROUTE,
  resolveIndexRouteTarget
} from "@/features/auth/utils/route-targets";

export default function IndexRoute() {
  const { isHydrating, user } = useAuthContext();
  const target = resolveIndexRouteTarget({
    isAuthenticated: Boolean(user),
    isHydrating
  });

  if (target === "bootstrap") {
    return <BootstrapScreen />;
  }

  return <Redirect href={target === AUTH_FLOW_ROUTE ? AUTH_FLOW_ROUTE : APP_SHELL_ROUTE} />;
}
