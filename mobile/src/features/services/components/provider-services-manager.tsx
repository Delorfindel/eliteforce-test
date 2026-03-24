import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { MutedText, UIText } from '@/components/ui/text';
import { createProviderCategoryOffering } from '@/features/services/api/create-provider-category-offering';
import { listCategories } from '@/features/services/api/list-categories';
import { listProviderCategoryOfferingsForCurrentUser } from '@/features/services/api/list-provider-category-offerings-for-current-user';
import { updateProviderCategoryOffering } from '@/features/services/api/update-provider-category-offering';
import { formatHourlyRateLabel } from '@/features/services/lib/formatters';
import type {
  ProviderCategoryOfferingFormValues,
  ProviderCategoryOfferingListItem,
  ServiceCategory,
} from '@/features/services/types';
import { Pressable, View } from '@/tw';

type ProviderServicesManagerProps = {
  providerId: string;
};

type OfferingFormProps = {
  categories: ServiceCategory[];
  initialOffering?: ProviderCategoryOfferingListItem | null;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (values: ProviderCategoryOfferingFormValues) => void;
};

function OfferingForm({
  categories,
  initialOffering,
  loading,
  onCancel,
  onSubmit,
}: OfferingFormProps) {
  const [categoryId, setCategoryId] = React.useState<number>(
    initialOffering?.category.id ?? categories[0]?.id ?? 0,
  );
  const [hourlyRate, setHourlyRate] = React.useState(
    initialOffering ? String(initialOffering.hourly_rate) : '',
  );
  const [isActive, setIsActive] = React.useState(initialOffering?.is_active ?? true);

  return (
    <View className="gap-4 rounded-2xl border border-brand-border bg-white p-4">
      <View className="gap-2">
        <UIText className="text-sm font-semibold">Catégorie</UIText>
        <View className="flex-row flex-wrap gap-2">
          {categories.map((category) => {
            const selected = category.id === categoryId;

            return (
              <Pressable
                key={category.id}
                className={`rounded-full px-4 py-2 ${selected ? 'bg-brand-clay' : 'bg-brand-sand-strong'}`}
                onPress={() => setCategoryId(category.id)}
              >
                <UIText
                  className={`text-sm font-semibold ${selected ? 'text-white' : 'text-brand-ink'}`}
                >
                  {category.name}
                </UIText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="gap-2">
        <UIText className="text-sm font-semibold">Tarif horaire</UIText>
        <Input
          keyboardType="decimal-pad"
          onChangeText={setHourlyRate}
          placeholder="41.85"
          value={hourlyRate}
        />
      </View>

      <Pressable
        className={`rounded-2xl px-4 py-3 ${isActive ? 'bg-brand-accent-light' : 'bg-brand-sand-strong'}`}
        onPress={() => setIsActive((current) => !current)}
      >
        <UIText className="text-sm font-semibold text-brand-ink">
          {isActive ? 'Visible dans la recherche' : 'Masquée dans la recherche'}
        </UIText>
      </Pressable>

      <View className="flex-row gap-3">
        <Button className="flex-1" onPress={onCancel} variant="ghost">
          Annuler
        </Button>
        <Button
          className="flex-1"
          loading={loading}
          onPress={() =>
            onSubmit({
              categoryId,
              hourlyRate: Number.parseFloat(hourlyRate || '0'),
              isActive,
              nextAvailableAt: null,
            })
          }
        >
          Enregistrer
        </Button>
      </View>
    </View>
  );
}

export function ProviderServicesManager({ providerId }: ProviderServicesManagerProps) {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = React.useState(false);
  const [editingOffering, setEditingOffering] =
    React.useState<ProviderCategoryOfferingListItem | null>(null);

  const categoriesQuery = useQuery({
    queryFn: listCategories,
    queryKey: ['service-categories'],
  });
  const offeringsQuery = useQuery({
    enabled: Boolean(providerId),
    queryFn: () => listProviderCategoryOfferingsForCurrentUser(providerId),
    queryKey: ['provider-category-offerings', providerId],
  });

  const invalidateMarketplace = React.useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['provider-category-offerings', providerId] }),
      queryClient.invalidateQueries({ queryKey: ['tasker-search'] }),
      queryClient.invalidateQueries({ queryKey: ['tasker-profile'] }),
    ]);
  }, [providerId, queryClient]);

  const createMutation = useMutation({
    mutationFn: (values: ProviderCategoryOfferingFormValues) =>
      createProviderCategoryOffering(providerId, values),
    onSuccess: async () => {
      setIsCreating(false);
      await invalidateMarketplace();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      offeringId,
      values,
    }: {
      offeringId: number;
      values: ProviderCategoryOfferingFormValues;
    }) => updateProviderCategoryOffering(offeringId, values),
    onSuccess: async () => {
      setEditingOffering(null);
      await invalidateMarketplace();
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const availableCategories = (categoriesQuery.data ?? []).filter(
    (category) =>
      editingOffering?.category.id === category.id ||
      !offeringsQuery.data?.some((offering) => offering.category.id === category.id),
  );

  return (
    <View className="gap-4 rounded-2xl bg-brand-card p-6 shadow-sm">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <UIText className="text-lg font-semibold">Mes services proposés</UIText>
          <MutedText className="text-sm leading-6">
            Choisissez les catégories que vous proposez, fixez votre taux horaire et activez
            seulement celles que vous souhaitez rendre visibles.
          </MutedText>
        </View>
        <Button
          className="min-h-10 px-4"
          disabled={!editingOffering && !availableCategories.length}
          onPress={() => {
            setEditingOffering(null);
            setIsCreating((current) => !current);
          }}
          variant={isCreating ? 'ghost' : 'primary'}
        >
          {isCreating ? 'Fermer' : 'Ajouter'}
        </Button>
      </View>

      {offeringsQuery.isLoading ? (
        <View className="items-center gap-3 py-6">
          <Spinner />
          <MutedText>Chargement de vos catégories...</MutedText>
        </View>
      ) : offeringsQuery.data?.length ? (
        <View className="gap-3">
          {offeringsQuery.data.map((offering) => (
            <View
              key={offering.id}
              className="gap-3 rounded-xl border border-brand-border bg-white p-4"
            >
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 gap-1">
                  <UIText className="text-base font-semibold">{offering.category.name}</UIText>
                  <MutedText className="text-sm">
                    {offering.completed_task_count} task
                    {offering.completed_task_count > 1 ? 's' : ''} réalisée
                    {offering.completed_task_count > 1 ? 's' : ''} à ce jour
                  </MutedText>
                </View>
                <View
                  className={`rounded-full px-3 py-1.5 ${
                    offering.is_active ? 'bg-brand-clay' : 'bg-brand-sand-strong'
                  }`}
                >
                  <UIText
                    className={`text-xs font-semibold ${
                      offering.is_active ? 'text-white' : 'text-brand-ink'
                    }`}
                  >
                    {offering.is_active ? 'Active' : 'Masquée'}
                  </UIText>
                </View>
              </View>

              <View className="flex-row items-center justify-between gap-3">
                <MutedText className="text-sm">
                  {formatHourlyRateLabel(offering.hourly_rate)}
                </MutedText>
                <Button
                  className="min-h-10 px-4"
                  onPress={() => {
                    setIsCreating(false);
                    setEditingOffering(offering);
                  }}
                  variant="ghost"
                >
                  Modifier
                </Button>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className="rounded-xl border border-dashed border-brand-border bg-white p-4">
          <MutedText className="text-sm leading-6">
            Aucune catégorie active pour le moment. Ajoutez-en une pour apparaître dans la
            recherche.
          </MutedText>
        </View>
      )}

      {(isCreating || editingOffering) && categoriesQuery.data ? (
        <OfferingForm
          categories={availableCategories}
          initialOffering={editingOffering}
          loading={isSubmitting}
          onCancel={() => {
            setEditingOffering(null);
            setIsCreating(false);
          }}
          onSubmit={(values) => {
            if (editingOffering) {
              updateMutation.mutate({
                offeringId: editingOffering.id,
                values,
              });
              return;
            }

            createMutation.mutate(values);
          }}
        />
      ) : null}

      <MutedText className="text-xs leading-5">
        Les avis et le nombre de tasks réalisées sont calculés automatiquement à partir de vos
        réservations confirmées.
      </MutedText>

      {!editingOffering && !availableCategories.length ? (
        <MutedText className="text-xs leading-5">
          Toutes les catégories disponibles sont déjà configurées sur votre profil.
        </MutedText>
      ) : null}

      {createMutation.error instanceof Error ? (
        <MutedText className="text-sm text-brand-danger">{createMutation.error.message}</MutedText>
      ) : null}

      {updateMutation.error instanceof Error ? (
        <MutedText className="text-sm text-brand-danger">{updateMutation.error.message}</MutedText>
      ) : null}
    </View>
  );
}
