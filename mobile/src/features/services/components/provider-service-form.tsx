import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl } from '@/components/ui/form-control';
import { Input } from '@/components/ui/input';
import { MutedText, UIText } from '@/components/ui/text';
import {
  type ProviderServiceSchemaValues,
  providerServiceSchema,
} from '@/features/services/schemas/provider-service-schema';
import type {
  ProviderServiceFormValues,
  ProviderServiceListItem,
  ServiceCategory,
} from '@/features/services/types';
import { Pressable, View } from '@/tw';

type ProviderServiceFormProps = {
  categories: ServiceCategory[];
  initialService?: ProviderServiceListItem | null;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (values: ProviderServiceFormValues) => void;
};

function buildDefaultValues(
  initialService?: ProviderServiceListItem | null,
): ProviderServiceSchemaValues {
  if (!initialService) {
    return {
      categoryId: 0,
      coverImageUrl: '',
      description: '',
      hourlyRate: 0,
      isActive: true,
      shortDescription: '',
      title: '',
    };
  }

  return {
    categoryId: initialService.category.id,
    coverImageUrl: initialService.cover_image_url ?? '',
    description: initialService.description,
    hourlyRate: initialService.hourly_rate,
    isActive: initialService.is_active,
    shortDescription: initialService.short_description,
    title: initialService.title,
  };
}

export function ProviderServiceForm({
  categories,
  initialService,
  loading,
  onCancel,
  onSubmit,
}: ProviderServiceFormProps) {
  const form = useForm<ProviderServiceSchemaValues>({
    defaultValues: buildDefaultValues(initialService),
    mode: 'onChange',
    resolver: zodResolver(providerServiceSchema),
  });

  React.useEffect(() => {
    form.reset(buildDefaultValues(initialService));
  }, [form, initialService]);

  return (
    <View className="gap-4 rounded-2xl border border-brand-border bg-white p-5">
      <View className="gap-1">
        <UIText className="text-lg font-semibold text-brand-ink">
          {initialService ? 'Modifier la prestation' : 'Ajouter une prestation'}
        </UIText>
        <MutedText className="text-sm">
          Renseigne les informations qui seront visibles dans la recherche et sur la fiche detail.
        </MutedText>
      </View>

      <Controller
        control={form.control}
        name="categoryId"
        render={({ field, fieldState }) => (
          <FormControl error={fieldState.error?.message} label="Categorie">
            <View className="flex-row flex-wrap gap-2">
              {categories.map((category) => {
                const isSelected = category.id === field.value;

                return (
                  <Pressable
                    key={category.id}
                    className={`rounded-full px-4 py-2.5 ${
                      isSelected ? 'bg-brand-clay' : 'bg-brand-sand-strong'
                    }`}
                    onPress={() => field.onChange(category.id)}
                  >
                    <UIText
                      className={`text-sm font-semibold ${
                        isSelected ? 'text-white' : 'text-brand-ink'
                      }`}
                    >
                      {category.name}
                    </UIText>
                  </Pressable>
                );
              })}
            </View>
          </FormControl>
        )}
      />

      <Controller
        control={form.control}
        name="title"
        render={({ field, fieldState }) => (
          <FormControl error={fieldState.error?.message} label="Titre">
            <Input onBlur={field.onBlur} onChangeText={field.onChange} value={field.value} />
          </FormControl>
        )}
      />

      <Controller
        control={form.control}
        name="shortDescription"
        render={({ field, fieldState }) => (
          <FormControl
            error={fieldState.error?.message}
            helperText="Visible dans les cartes Home et Search."
            label="Description courte"
          >
            <Input onBlur={field.onBlur} onChangeText={field.onChange} value={field.value} />
          </FormControl>
        )}
      />

      <Controller
        control={form.control}
        name="description"
        render={({ field, fieldState }) => (
          <FormControl error={fieldState.error?.message} label="Description detaillee">
            <Input
              className="min-h-28 py-4"
              multiline
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              textAlignVertical="top"
              value={field.value}
            />
          </FormControl>
        )}
      />

      <Controller
        control={form.control}
        name="hourlyRate"
        render={({ field, fieldState }) => (
          <FormControl error={fieldState.error?.message} label="Tarif horaire">
            <Input
              keyboardType="numeric"
              onBlur={field.onBlur}
              onChangeText={(value) => field.onChange(Number(value) || 0)}
              value={field.value === 0 ? '' : String(field.value)}
            />
          </FormControl>
        )}
      />

      <Controller
        control={form.control}
        name="coverImageUrl"
        render={({ field, fieldState }) => (
          <FormControl
            error={fieldState.error?.message}
            helperText="Optionnel, mais recommande pour une fiche plus claire."
            label="Image de couverture"
          >
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              placeholder="https://..."
              value={field.value}
            />
          </FormControl>
        )}
      />

      <Controller
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <Checkbox
            checked={field.value}
            label="Rendre cette prestation visible dans la recherche et la home."
            onChange={field.onChange}
          />
        )}
      />

      <View className="flex-row gap-3">
        <Button className="flex-1" loading={loading} onPress={form.handleSubmit(onSubmit)}>
          {initialService ? 'Enregistrer' : 'Publier'}
        </Button>
        <Button className="flex-1" onPress={onCancel} variant="ghost">
          Annuler
        </Button>
      </View>
    </View>
  );
}
