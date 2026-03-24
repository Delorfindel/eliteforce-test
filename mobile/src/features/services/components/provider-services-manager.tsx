import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Switch } from 'react-native';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { MutedText, UIText } from '@/components/ui/text';
import { deleteProviderCategoryOffering } from '@/features/services/api/delete-provider-category-offering';
import { listCategories } from '@/features/services/api/list-categories';
import { listProviderCategoryOfferingsForCurrentUser } from '@/features/services/api/list-provider-category-offerings-for-current-user';
import { updateProviderCategoryOffering } from '@/features/services/api/update-provider-category-offering';
import { formatHourlyRateLabel } from '@/features/services/lib/formatters';
import type { ProviderCategoryOfferingListItem } from '@/features/services/types';
import { Pressable, View } from '@/tw';

type ProviderServicesManagerProps = {
  providerId: string;
};

export function ProviderServicesManager({ providerId }: ProviderServicesManagerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pendingToggleId, setPendingToggleId] = React.useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<number | null>(null);

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

  const updateMutation = useMutation({
    mutationFn: ({
      offering,
      isActive,
    }: {
      offering: ProviderCategoryOfferingListItem;
      isActive: boolean;
    }) =>
      updateProviderCategoryOffering(offering.id, {
        categoryId: offering.category.id,
        hourlyRate: offering.hourly_rate,
        isActive,
        nextAvailableAt: offering.next_available_at,
      }),
    onMutate: async ({ offering, isActive }) => {
      setPendingToggleId(offering.id);
      await queryClient.cancelQueries({ queryKey: ['provider-category-offerings', providerId] });

      const previousOfferings = queryClient.getQueryData<ProviderCategoryOfferingListItem[]>([
        'provider-category-offerings',
        providerId,
      ]);

      queryClient.setQueryData<ProviderCategoryOfferingListItem[]>(
        ['provider-category-offerings', providerId],
        (current) =>
          current?.map((item) =>
            item.id === offering.id
              ? {
                  ...item,
                  is_active: isActive,
                }
              : item,
          ) ?? [],
      );

      return { previousOfferings };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousOfferings) {
        queryClient.setQueryData(
          ['provider-category-offerings', providerId],
          context.previousOfferings,
        );
      }
    },
    onSettled: () => {
      setPendingToggleId(null);
    },
    onSuccess: invalidateMarketplace,
  });

  const deleteMutation = useMutation({
    mutationFn: (offeringId: number) => deleteProviderCategoryOffering(offeringId),
    onMutate: async (offeringId) => {
      setPendingDeleteId(offeringId);
      await queryClient.cancelQueries({ queryKey: ['provider-category-offerings', providerId] });

      const previousOfferings = queryClient.getQueryData<ProviderCategoryOfferingListItem[]>([
        'provider-category-offerings',
        providerId,
      ]);

      queryClient.setQueryData<ProviderCategoryOfferingListItem[]>(
        ['provider-category-offerings', providerId],
        (current) => current?.filter((item) => item.id !== offeringId) ?? [],
      );

      return { previousOfferings };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousOfferings) {
        queryClient.setQueryData(
          ['provider-category-offerings', providerId],
          context.previousOfferings,
        );
      }
    },
    onSettled: () => {
      setPendingDeleteId(null);
    },
    onSuccess: invalidateMarketplace,
  });

  const canAddService =
    offeringsQuery.isLoading ||
    categoriesQuery.isLoading ||
    (offeringsQuery.data?.length ?? 0) < (categoriesQuery.data?.length ?? 0);

  return (
    <View className="gap-4">
      <Button className="w-full" disabled={!canAddService} onPress={() => router.push('/services/new')}>
        Ajouter un service
      </Button>

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
              className="gap-4 rounded-[24px] border border-brand-border bg-white p-5"
            >
              <View className="flex-row items-start justify-between gap-4">
                <View className="flex-1 gap-1">
                  <UIText className="text-base font-semibold">{offering.category.name}</UIText>
                  <MutedText className="text-sm">
                    {offering.completed_task_count} task
                    {offering.completed_task_count > 1 ? 's' : ''} réalisée
                    {offering.completed_task_count > 1 ? 's' : ''} à ce jour
                  </MutedText>
                </View>
                <View className="flex-row items-center gap-3">
                  <MutedText className="text-xs font-semibold">
                    {offering.is_active ? 'Actif' : 'Masqué'}
                  </MutedText>
                  <Switch
                    disabled={Boolean(pendingDeleteId || pendingToggleId)}
                    ios_backgroundColor="#E5E5E5"
                    onValueChange={(value) =>
                      updateMutation.mutate({
                        isActive: value,
                        offering,
                      })
                    }
                    trackColor={{ false: '#E5E5E5', true: '#CDEEE3' }}
                    thumbColor={offering.is_active ? '#0E7051' : '#FFFFFF'}
                    value={offering.is_active}
                  />
                </View>
              </View>

              <View className="flex-row items-center justify-between gap-4">
                <UIText className="text-base font-semibold">
                  {formatHourlyRateLabel(offering.hourly_rate)}
                </UIText>
                <View className="flex-row gap-2">
                  <Button
                    className="min-h-10 px-4"
                    onPress={() => router.push(`/services/${offering.id}`)}
                    variant="ghost"
                  >
                    Modifier
                  </Button>
                  <Pressable
                    accessibilityLabel="Supprimer le service"
                    accessibilityRole="button"
                    className="h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-white"
                    onPress={() =>
                      Alert.alert(
                        'Supprimer ce service ?',
                        'Il sera retiré de votre profil prestataire.',
                        [
                          { style: 'cancel', text: 'Annuler' },
                          {
                            style: 'destructive',
                            text: 'Supprimer',
                            onPress: () => deleteMutation.mutate(offering.id),
                          },
                        ],
                      )
                    }
                  >
                    <MaterialCommunityIcons
                      color="#525252"
                      name={pendingDeleteId === offering.id && deleteMutation.isPending ? 'loading' : 'trash-can-outline'}
                      size={18}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className="rounded-xl border border-dashed border-brand-border bg-white p-5">
          <MutedText className="text-sm leading-6">
            Aucun service configuré pour le moment. Ajoutez-en un pour apparaître dans la
            recherche.
          </MutedText>
        </View>
      )}

      {updateMutation.error instanceof Error ? (
        <MutedText className="text-sm text-brand-danger">{updateMutation.error.message}</MutedText>
      ) : null}

      {deleteMutation.error instanceof Error ? (
        <MutedText className="text-sm text-brand-danger">{deleteMutation.error.message}</MutedText>
      ) : null}

      {!canAddService ? (
        <MutedText className="text-xs leading-5">
          Toutes les catégories disponibles sont déjà configurées sur votre profil.
        </MutedText>
      ) : null}

      <MutedText className="text-xs leading-5">
        Les avis et le nombre de tasks réalisées sont calculés automatiquement à partir de vos
        réservations confirmées.
      </MutedText>
    </View>
  );
}
