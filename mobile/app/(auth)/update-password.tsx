import { useURL } from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { UpdatePasswordForm } from "@/features/auth/components/update-password-form";
import { AuthScreenShell } from "@/features/auth/components/auth-screen-shell";
import { resolveRecoveryParams } from "@/features/auth/utils/recovery-params";
import { AUTH_FLOW_ROUTE } from "@/features/auth/utils/route-targets";

export default function UpdatePasswordRoute() {
  const params = useLocalSearchParams<{
    access_token?: string;
    refresh_token?: string;
    token_hash?: string;
    type?: string;
  }>();
  const currentUrl = useURL();
  const router = useRouter();
  const recoveryParams = React.useMemo(
    () =>
      resolveRecoveryParams(
        {
          access_token: params.access_token,
          refresh_token: params.refresh_token,
          token_hash: params.token_hash,
          type: params.type
        },
        currentUrl ?? undefined
      ),
    [
      currentUrl,
      params.access_token,
      params.refresh_token,
      params.token_hash,
      params.type
    ]
  );

  return (
    <AuthScreenShell
      description="Choose a new password to complete your recovery flow."
      footerHref={AUTH_FLOW_ROUTE}
      footerLabel="Return to login"
      footerText="Back to the main sign-in screen?"
      title="Create a new password"
    >
      <UpdatePasswordForm
        onSuccess={() => router.replace(AUTH_FLOW_ROUTE)}
        recoveryParams={recoveryParams}
      />
    </AuthScreenShell>
  );
}
