import { expect, test } from "@jest/globals";

import {
  APP_SHELL_ROUTE,
  AUTH_FLOW_ROUTE,
  resolveIndexRouteTarget,
  resolveProtectedRouteTarget
} from "@/features/auth/utils/route-targets";

test("returns the bootstrap state while auth hydration is unresolved", () => {
  expect(
    resolveIndexRouteTarget({
      isAuthenticated: false,
      isHydrating: true
    })
  ).toBe("bootstrap");
});

test("resolves guest redirects to the auth flow", () => {
  expect(
    resolveIndexRouteTarget({
      isAuthenticated: false,
      isHydrating: false
    })
  ).toBe(AUTH_FLOW_ROUTE);
  expect(
    resolveProtectedRouteTarget({
      isAuthenticated: false,
      isHydrating: false
    })
  ).toBe(AUTH_FLOW_ROUTE);
});

test("resolves authenticated entry into the tab shell and keeps protected routes open", () => {
  expect(
    resolveIndexRouteTarget({
      isAuthenticated: true,
      isHydrating: false
    })
  ).toBe(APP_SHELL_ROUTE);
  expect(
    resolveProtectedRouteTarget({
      isAuthenticated: true,
      isHydrating: false
    })
  ).toBeNull();
});

test("keeps logout redirect routing pinned to the auth flow", () => {
  expect(AUTH_FLOW_ROUTE).toBe("/login");
});
