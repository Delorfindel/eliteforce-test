const DUPLICATE_EMAIL_ERROR = "An account already exists for this email.";
const INVALID_CREDENTIALS_ERROR = "Email or password is incorrect.";
const PROVISIONING_ERROR =
  "We could not finish creating your account. Please try again.";
const FORGOT_PASSWORD_SUCCESS =
  "If an account exists for this email, you will receive a reset link.";

export const authMessages = {
  duplicateEmail: DUPLICATE_EMAIL_ERROR,
  forgotPasswordSuccess: FORGOT_PASSWORD_SUCCESS,
  invalidCredentials: INVALID_CREDENTIALS_ERROR,
  provisioningError: PROVISIONING_ERROR
} as const;

export function normalizeAuthError(error: unknown) {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  if (
    message.includes("already registered") ||
    message.includes("already exists") ||
    message.includes("user_already_exists")
  ) {
    return DUPLICATE_EMAIL_ERROR;
  }

  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid credentials")
  ) {
    return INVALID_CREDENTIALS_ERROR;
  }

  return "Something went wrong. Please try again.";
}
