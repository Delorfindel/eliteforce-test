import { z } from 'zod';

export const providerServiceSchema = z.object({
  categoryId: z.number().int().positive('Choisissez une categorie.'),
  coverImageUrl: z.string().trim().url("Entrez une URL valide pour l'image.").or(z.literal('')),
  description: z
    .string()
    .trim()
    .min(20, 'La description detaillee doit contenir au moins 20 caracteres.'),
  hourlyRate: z.number().positive('Entrez un tarif horaire valide.'),
  isActive: z.boolean(),
  shortDescription: z.string().trim().min(10, 'Ajoutez un resume court pour la recherche.'),
  title: z.string().trim().min(4, 'Le titre doit contenir au moins 4 caracteres.'),
});

export type ProviderServiceSchemaValues = z.infer<typeof providerServiceSchema>;
