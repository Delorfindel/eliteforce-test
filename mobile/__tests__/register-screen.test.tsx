import { expect, test } from '@jest/globals';

import { authMessages, normalizeAuthError } from '@/features/auth/api/errors';
import { registerSchema } from '@/features/auth/schemas/register-schema';

test('rejects invalid registration fields and missing terms acceptance', () => {
  const result = registerSchema.safeParse({
    acceptedTerms: false,
    confirmPassword: 'short',
    email: 'not-an-email',
    firstName: 'A',
    lastName: 'B',
    password: 'short',
    phone: '0612345678',
  });

  expect(result.success).toBe(false);

  if (!result.success) {
    const issues = result.error.issues.map((issue) => issue.message);
    expect(issues).toContain('First name must be at least 2 characters.');
    expect(issues).toContain('Enter a valid email address.');
    expect(issues).toContain('Phone number must use the +212XXXXXXXXX format.');
    expect(issues).toContain('You must accept the terms to continue.');
  }
});

test('accepts a fully valid registration payload', () => {
  const result = registerSchema.safeParse({
    acceptedTerms: true,
    confirmPassword: 'Password1',
    email: 'amina@example.com',
    firstName: 'Amina',
    lastName: 'Bennani',
    password: 'Password1',
    phone: '+212612345678',
  });

  expect(result.success).toBe(true);
});

test('normalizes duplicate-email auth responses into the required UI copy', () => {
  expect(normalizeAuthError(new Error('User already registered'))).toBe(
    authMessages.duplicateEmail,
  );
});
