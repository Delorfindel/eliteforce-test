import { expect, jest, test } from "@jest/globals";

import { resolveRecoveryParams } from "@/features/auth/utils/recovery-params";
import { establishRecoverySession } from "@/features/auth/utils/recovery-session";
import { passwordConfirmationSchema } from "@/features/auth/schemas/password-schema";

test("rejects mismatched password confirmation", () => {
  const result = passwordConfirmationSchema.safeParse({
    confirmPassword: "Password2",
    password: "Password1"
  });

  expect(result.success).toBe(false);

  if (!result.success) {
    expect(result.error.issues[0]?.message).toBe("Passwords do not match.");
  }
});

test("hydrates the recovery session from access and refresh tokens", async () => {
  const auth = {
    setSession: jest.fn().mockResolvedValue({ error: null } as never),
    verifyOtp: jest.fn()
  };

  const result = await establishRecoverySession({
    auth: auth as any,
    isAuthenticated: false,
    recoveryParams: {
      access_token: "access-token",
      refresh_token: "refresh-token"
    }
  });

  expect(result).toBe("session");
  expect(auth.setSession).toHaveBeenCalledWith({
    access_token: "access-token",
    refresh_token: "refresh-token"
  });
});

test("parses fragment-based recovery tokens from deep links", () => {
  expect(
    resolveRecoveryParams(
      {},
      "eliteforce://update-password#access_token=access-token&refresh_token=refresh-token&type=recovery"
    )
  ).toEqual({
    access_token: "access-token",
    refresh_token: "refresh-token",
    token_hash: undefined,
    type: "recovery"
  });
});

test("rejects invalid recovery links when there is no active authenticated session", async () => {
  const auth = {
    setSession: jest.fn(),
    verifyOtp: jest.fn()
  };

  await expect(
    establishRecoverySession({
      auth: auth as any,
      isAuthenticated: false,
      recoveryParams: {}
    })
  ).rejects.toThrow("This reset link is invalid or has expired.");
});
