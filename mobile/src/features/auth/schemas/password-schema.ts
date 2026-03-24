import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir une majuscule.')
  .regex(/[a-z]/, 'Le mot de passe doit contenir une minuscule.')
  .regex(/[0-9]/, 'Le mot de passe doit contenir un chiffre.');

export const passwordConfirmationSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Veuillez confirmer votre mot de passe.'),
  })
  .superRefine(({ confirmPassword, password }, context) => {
    if (password !== confirmPassword) {
      context.addIssue({
        code: 'custom',
        message: 'Les mots de passe ne correspondent pas.',
        path: ['confirmPassword'],
      });
    }
  });
