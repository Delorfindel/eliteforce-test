import { Redirect, useRouter } from "expo-router";
import React from "react";
import { AuthScreenShell } from "@/features/auth/components/auth-screen-shell";
import { RegisterForm } from "@/features/auth/components/register-form";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { APP_SHELL_ROUTE } from "@/features/auth/utils/route-targets";

export default function RegisterRoute() {
  const router = useRouter();
  const { isAuthenticated, isHydrating } = useAuthSession();

  if (!isHydrating && isAuthenticated) {
    return <Redirect href={APP_SHELL_ROUTE} />;
  }

  return (
    <AuthScreenShell
      description="Create your account to discover trusted household services and manage future bookings."
      footerHref="/login"
      footerLabel="Sign in"
      footerText="Already registered?"
      title="Create your account"
    >
      <RegisterForm onSuccess={() => router.replace(APP_SHELL_ROUTE)} />
    </AuthScreenShell>
  );
}
