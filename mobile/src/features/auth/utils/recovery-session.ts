type RecoveryParams = {
  access_token?: string;
  refresh_token?: string;
  token_hash?: string;
  type?: string;
};

type RecoveryAuthClient = {
  setSession: (session: {
    access_token: string;
    refresh_token: string;
  }) => Promise<{ error: Error | null }>;
  verifyOtp: (options: {
    token_hash: string;
    type: 'recovery';
  }) => Promise<{ error: Error | null }>;
};

export async function establishRecoverySession({
  auth,
  isAuthenticated,
  recoveryParams,
}: {
  auth: RecoveryAuthClient;
  isAuthenticated: boolean;
  recoveryParams: RecoveryParams;
}) {
  if (recoveryParams.access_token && recoveryParams.refresh_token) {
    const result = await auth.setSession({
      access_token: recoveryParams.access_token,
      refresh_token: recoveryParams.refresh_token,
    });

    if (result.error) {
      throw result.error;
    }

    return 'session' as const;
  }

  if (recoveryParams.token_hash && recoveryParams.type === 'recovery') {
    const result = await auth.verifyOtp({
      token_hash: recoveryParams.token_hash,
      type: 'recovery',
    });

    if (result.error) {
      throw result.error;
    }

    return 'otp' as const;
  }

  if (!isAuthenticated) {
    throw new Error('This reset link is invalid or has expired.');
  }

  return 'existing-session' as const;
}
