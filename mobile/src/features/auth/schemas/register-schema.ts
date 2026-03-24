import { z } from 'zod';

import { passwordSchema } from '@/features/auth/schemas/password-schema';

const moroccoPhoneRegex = /^\+212\d{9}$/;

export const registerSchema = z.object({
  firstName: z.string().trim().min(2, 'Le prénom doit contenir au moins 2 caractères.'),
  lastName: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  email: z.string().trim().email('Veuillez entrer un e-mail valide.'),
  phone: z
    .string()
    .trim()
    .regex(moroccoPhoneRegex, 'Le téléphone doit être au format +212XXXXXXXXX.'),
  password: passwordSchema,
  acceptedTerms: z.boolean().refine((value) => value === true, {
    message: 'Vous devez accepter les conditions pour continuer.',
  }),
  optOutPromotions: z.boolean().optional(),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
