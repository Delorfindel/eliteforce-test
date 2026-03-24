import { expect, test } from '@jest/globals';
import { passwordConfirmationSchema } from '@/features/auth/schemas/password-schema';
import { resolveRecoveryParams } from '@/features/auth/utils/recovery-params';
import { establishRecoverySession } from '@/features/auth/utils/recovery-session';

test('rejects mismatched password confirmation', () => {
  const result = passwordConfirmationSchema.safeParse({
    confirmPassword: 'Password2',
    password: 'Password1',
  });

  expect(result.success).toBe(false);

  if (!result.success) {
    expect(result.error.issues[0]?.message).toBe('Passwords do not match.');
  }
});

test('hydrates the recovery session from access and refresh tokens', async () => {
  const setSessionCalls: Array<{
    access_token: string;
    refresh_token: string;
  }> = [];
  const auth: Parameters<typeof establishRecoverySession>[0]['auth'] = {
    setSession: async (session) => {
      setSessionCalls.push(session);
      return { error: null };
    },
    verifyOtp: async () => ({ error: null }),
  };

  const result = await establishRecoverySession({
    auth,
    isAuthenticated: false,
    recoveryParams: {
      access_token: 'access-token',
      refresh_token: 'refresh-token',
    },
  });

  expect(result).toBe('session');
  expect(setSessionCalls).toEqual([
    {
      access_token: 'access-token',
      refresh_token: 'refresh-token',
    },
  ]);
});

test('parses fragment-based recovery tokens from deep links', () => {
  expect(
    resolveRecoveryParams(
      {},
      'eliteforce://update-password#access_token=access-token&refresh_token=refresh-token&type=recovery',
    ),
  ).toEqual({
    access_token: 'access-token',
    refresh_token: 'refresh-token',
    token_hash: undefined,
    type: 'recovery',
  });
});

test('rejects invalid recovery links when there is no active authenticated session', async () => {
  const auth: Parameters<typeof establishRecoverySession>[0]['auth'] = {
    setSession: async () => ({ error: null }),
    verifyOtp: async () => ({ error: null }),
  };

  await expect(
    establishRecoverySession({
      auth,
      isAuthenticated: false,
      recoveryParams: {},
    }),
  ).rejects.toThrow('This reset link is invalid or has expired.');
});
