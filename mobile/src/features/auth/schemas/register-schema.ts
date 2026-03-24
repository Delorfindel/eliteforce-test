import { z } from 'zod';

import { passwordSchema } from '@/features/auth/schemas/password-schema';

const moroccoPhoneRegex = /^\+212\d{9}$/;

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, 'First name must be at least 2 characters.'),
    lastName: z.string().trim().min(2, 'Last name must be at least 2 characters.'),
    email: z.string().trim().email('Enter a valid email address.'),
    phone: z
      .string()
      .trim()
      .regex(moroccoPhoneRegex, 'Phone number must use the +212XXXXXXXXX format.'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    acceptedTerms: z.boolean().refine((value) => value, {
      message: 'You must accept the terms to continue.',
    }),
  })
  .superRefine(({ confirmPassword, password }, context) => {
    if (password !== confirmPassword) {
      context.addIssue({
        code: 'custom',
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
      });
    }
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
