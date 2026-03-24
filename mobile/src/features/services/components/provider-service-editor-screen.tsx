import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Redirect, Stack, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { MutedText, UIText } from '@/components/ui/text';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { createProviderCategoryOffering } from '@/features/services/api/create-provider-category-offering';
import { deleteProviderCategoryOffering } from '@/features/services/api/delete-provider-category-offering';
import { listCategories } from '@/features/services/api/list-categories';
import { listProviderCategoryOfferingsForCurrentUser } from '@/features/services/api/list-provider-category-offerings-for-current-user';
import { updateProviderCategoryOffering } from '@/features/services/api/update-provider-category-offering';
import type { ProviderCategoryOfferingFormValues } from '@/features/services/types';
import { Pressable, ScrollView, View } from '@/tw';

type ProviderServiceEditorScreenProps = {
  offeringId?: number;
};

export function ProviderServiceEditorScreen({
  offeringId,
}: ProviderServiceEditorScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { isProfileLoading, profile } = useAuthSession();
  const isEditing = typeof offeringId === 'number';

  const categoriesQuery = useQuery({
    enabled: Boolean(profile?.id),
    queryFn: listCategories,
    queryKey: ['service-categories'],
  });
  const offeringsQuery = useQuery({
    enabled: Boolean(profile?.id),
    queryFn: () => listProviderCategoryOfferingsForCurrentUser(profile?.id ?? ''),
    queryKey: ['provider-category-offerings', profile?.id],
  });

  const currentOffering = React.useMemo(
    () => offeringsQuery.data?.find((offering) => offering.id === offeringId) ?? null,
    [offeringId, offeringsQuery.data],
  );

  const availableCategories = React.useMemo(
    () =>
      (categoriesQuery.data ?? []).filter(
        (category) =>
          currentOffering?.category.id === category.id ||
          !offeringsQuery.data?.some((offering) => offering.category.id === category.id),
      ),
    [categoriesQuery.data, currentOffering?.category.id, offeringsQuery.data],
  );

  const [categoryId, setCategoryId] = React.useState(0);
  const [hourlyRate, setHourlyRate] = React.useState('');
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    if (currentOffering) {
      setCategoryId(currentOffering.category.id);
      setHourlyRate(String(currentOffering.hourly_rate));
      setIsActive(currentOffering.is_active);
      return;
    }

    if (!isEditing && availableCategories[0]) {
      setCategoryId((current) => current || availableCategories[0].id);
      setHourlyRate((current) => current || '');
      setIsActive(true);
    }
  }, [availableCategories, currentOffering, isEditing]);

  const invalidateMarketplace = React.useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['provider-category-offerings', profile?.id] }),
      queryClient.invalidateQueries({ queryKey: ['tasker-search'] }),
      queryClient.invalidateQueries({ queryKey: ['tasker-profile'] }),
    ]);
  }, [profile?.id, queryClient]);

  const saveMutation = useMutation({
    mutationFn: async (values: ProviderCategoryOfferingFormValues) => {
      if (!profile?.id) {
        throw new Error('Profil prestataire introuvable.');
      }

      if (isEditing && currentOffering) {
        return updateProviderCategoryOffering(currentOffering.id, values);
      }

      return createProviderCategoryOffering(profile.id, values);
    },
    onSuccess: async () => {
      await invalidateMarketplace();
      router.replace('/services');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!currentOffering) {
        throw new Error('Service introuvable.');
      }

      await deleteProviderCategoryOffering(currentOffering.id);
    },
    onSuccess: async () => {
      await invalidateMarketplace();
      router.replace('/services');
    },
  });

  if (isProfileLoading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 items-center justify-center bg-white">
          <Spinner size="large" />
        </View>
      </>
    );
  }

  if (profile?.role !== 'provider') {
    return <Redirect href="/profile" />;
  }

  const isLoading = categoriesQuery.isLoading || offeringsQuery.isLoading;

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 items-center justify-center bg-white">
          <Spinner size="large" />
        </View>
      </>
    );
  }

  if (isEditing && !currentOffering) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 bg-white">
          <View
            className="flex-row items-center border-b border-brand-border bg-white px-5 pb-5"
            style={{ paddingTop: insets.top + 8 }}
          >
            <MaterialCommunityIcons
              color="#0A0A0A"
              name="chevron-left"
              onPress={() => router.replace('/services')}
              size={36}
            />
            <View className="flex-1 items-center">
              <UIText className="text-[20px] font-semibold">Modifier le service</UIText>
            </View>
            <View className="w-10" />
          </View>

          <View className="flex-1 items-center justify-center px-5">
            <UIText className="text-lg font-semibold">Service introuvable</UIText>
            <MutedText className="mt-2 text-center text-sm leading-6">
              Ce service n’existe plus sur votre profil.
            </MutedText>
          </View>
        </View>
      </>
    );
  }

  const noCategoriesLeft = !isEditing && availableCategories.length === 0;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-white">
        <View
          className="flex-row items-center border-b border-brand-border bg-white px-5 pb-5"
          style={{ paddingTop: insets.top + 8 }}
        >
          <MaterialCommunityIcons
            color="#0A0A0A"
            name="chevron-left"
            onPress={() => router.replace('/services')}
            size={36}
          />
          <View className="flex-1 items-center">
            <UIText className="text-[20px] font-semibold">
              {isEditing ? 'Modifier le service' : 'Ajouter un service'}
            </UIText>
          </View>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1" contentContainerClassName="gap-6 px-5 pb-10 pt-6">
          {noCategoriesLeft ? (
            <View className="gap-4 rounded-3xl border border-dashed border-brand-border bg-white p-5">
              <UIText className="text-lg font-semibold">
                Tous vos services sont déjà configurés
              </UIText>
              <MutedText className="mt-2 text-sm leading-6">
                Vous avez déjà ajouté toutes les catégories disponibles. Modifiez un service
                existant si vous souhaitez ajuster son tarif ou sa visibilité.
              </MutedText>
              <Button onPress={() => router.replace('/services')} variant="ghost">
                Retour aux services
              </Button>
            </View>
          ) : (
            <>
              <View className="gap-3">
                <UIText className="text-sm font-semibold">Catégorie</UIText>
                <View className="flex-row flex-wrap gap-2">
                  {availableCategories.map((category) => {
                    const selected = category.id === categoryId;

                    return (
                      <Pressable
                        key={category.id}
                        className={`rounded-full px-4 py-2 ${
                          selected ? 'bg-brand-clay' : 'bg-brand-sand-strong'
                        }`}
                        onPress={() => setCategoryId(category.id)}
                      >
                        <UIText
                          className={`text-sm font-semibold ${
                            selected ? 'text-white' : 'text-brand-ink'
                          }`}
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

              <View className="rounded-3xl border border-brand-border bg-white p-4">
                <View className="flex-row items-center justify-between gap-4">
                  <View className="flex-1">
                    <UIText className="text-base font-semibold">Service actif</UIText>
                    <MutedText className="mt-1 text-sm leading-6">
                      {isActive
                        ? 'Visible dans la recherche et réservable immédiatement.'
                        : 'Masqué dans la recherche sans supprimer son historique.'}
                    </MutedText>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <MutedText className="text-xs font-semibold">
                      {isActive ? 'Actif' : 'Masqué'}
                    </MutedText>
                    <Switch
                      ios_backgroundColor="#E5E5E5"
                      onValueChange={setIsActive}
                      trackColor={{ false: '#E5E5E5', true: '#CDEEE3' }}
                      thumbColor={isActive ? '#0E7051' : '#FFFFFF'}
                      value={isActive}
                    />
                  </View>
                </View>
              </View>

              {currentOffering ? (
                <MutedText className="text-sm leading-6">
                  {currentOffering.completed_task_count} task
                  {currentOffering.completed_task_count > 1 ? 's' : ''} réalisée
                  {currentOffering.completed_task_count > 1 ? 's' : ''} à ce jour.
                </MutedText>
              ) : null}

              {saveMutation.error instanceof Error ? (
                <MutedText className="text-sm text-brand-danger">
                  {saveMutation.error.message}
                </MutedText>
              ) : null}

              {deleteMutation.error instanceof Error ? (
                <MutedText className="text-sm text-brand-danger">
                  {deleteMutation.error.message}
                </MutedText>
              ) : null}

              <View className="gap-3 pt-2">
                <Button
                  disabled={!categoryId || !hourlyRate.trim()}
                  loading={saveMutation.isPending}
                  onPress={() =>
                    saveMutation.mutate({
                      categoryId,
                      hourlyRate: Number.parseFloat(hourlyRate || '0'),
                      isActive,
                      nextAvailableAt: null,
                    })
                  }
                >
                  Enregistrer
                </Button>

                <Button onPress={() => router.replace('/services')} variant="ghost">
                  Annuler
                </Button>

                {isEditing ? (
                  <View className="items-center pt-2">
                    <Pressable
                      accessibilityLabel="Supprimer le service"
                      accessibilityRole="button"
                      className="h-11 w-11 items-center justify-center rounded-full border border-brand-border bg-white"
                      disabled={deleteMutation.isPending}
                      onPress={() =>
                        Alert.alert(
                          'Supprimer ce service ?',
                          'Il sera retiré de votre profil prestataire.',
                          [
                            { style: 'cancel', text: 'Annuler' },
                            {
                              style: 'destructive',
                              text: 'Supprimer',
                              onPress: () => deleteMutation.mutate(),
                            },
                          ],
                        )
                      }
                    >
                      <MaterialCommunityIcons
                        color="#525252"
                        name={deleteMutation.isPending ? 'loading' : 'trash-can-outline'}
                        size={20}
                      />
                    </Pressable>
                  </View>
                ) : null}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </>
  );
}
