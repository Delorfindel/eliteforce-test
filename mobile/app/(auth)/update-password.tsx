import { useURL } from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { AuthScreenShell } from '@/features/auth/components/auth-screen-shell';
import { UpdatePasswordForm } from '@/features/auth/components/update-password-form';
import { resolveRecoveryParams } from '@/features/auth/utils/recovery-params';
import { AUTH_FLOW_ROUTE } from '@/features/auth/utils/route-targets';

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
          type: params.type,
        },
        currentUrl ?? undefined,
      ),
    [currentUrl, params.access_token, params.refresh_token, params.token_hash, params.type],
  );

  return (
    <AuthScreenShell
      description="Choisissez un nouveau mot de passe pour terminer votre procédure de récupération."
      footerHref={AUTH_FLOW_ROUTE}
      footerLabel="Retour à la connexion"
      footerText="Retourner à l'écran de connexion principal ?"
      title="Créer un nouveau mot de passe"
    >
      <UpdatePasswordForm
        onSuccess={() => router.replace(AUTH_FLOW_ROUTE)}
        recoveryParams={recoveryParams}
      />
    </AuthScreenShell>
  );
}
