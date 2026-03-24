import { expect, test } from '@jest/globals';

import { authMessages, normalizeAuthError } from '@/features/auth/api/errors';
import { registerSchema } from '@/features/auth/schemas/register-schema';

test('rejects invalid registration fields and missing terms acceptance', () => {
  const result = registerSchema.safeParse({
    acceptedTerms: false,
    email: 'not-an-email',
    firstName: 'A',
    lastName: 'B',
    password: 'short',
    phone: '0612345678',
  });

  expect(result.success).toBe(false);

  if (!result.success) {
    const issues = result.error.issues.map((issue) => issue.message);
    expect(issues).toContain('Le prénom doit contenir au moins 2 caractères.');
    expect(issues).toContain('Veuillez entrer un e-mail valide.');
    expect(issues).toContain('Le téléphone doit être au format +212XXXXXXXXX.');
    expect(issues).toContain('Vous devez accepter les conditions pour continuer.');
  }
});

test('accepts a fully valid registration payload', () => {
  const result = registerSchema.safeParse({
    acceptedTerms: true,
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
