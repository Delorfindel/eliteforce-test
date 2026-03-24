import { useFocusEffect, Redirect } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Input } from '@/components/ui/input';
import { MutedText, UIText } from '@/components/ui/text';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import {
  getProviderProfile,
  updateProviderProfileBio,
} from '@/features/services/api/provider-profile';
import { ProviderServicesManager } from '@/features/services/components/provider-services-manager';
import { ScrollView, View } from '@/tw';

const PROVIDER_BIO_MAX_LENGTH = 280;

export default function ServicesRoute() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { profile } = useAuthSession();
  const [bioDraft, setBioDraft] = React.useState('');
  const [saveState, setSaveState] = React.useState<'idle' | 'pending' | 'saving' | 'saved' | 'error'>(
    'idle',
  );
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const initializedRef = React.useRef(false);
  const lastSavedBioRef = React.useRef('');
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightBioRef = React.useRef<string | null>(null);

  const providerProfileQuery = useQuery({
    enabled: Boolean(profile?.id),
    queryFn: () => getProviderProfile(profile?.id ?? ''),
    queryKey: ['provider-profile', profile?.id],
  });

  const saveBioMutation = useMutation({
    mutationFn: async (bio: string) => {
      if (!profile?.id) {
        throw new Error('Profil prestataire introuvable.');
      }

      return updateProviderProfileBio(profile.id, bio);
    },
    onSuccess: async (providerProfile) => {
      lastSavedBioRef.current = providerProfile.bio;
      queryClient.setQueryData(['provider-profile', profile?.id], providerProfile);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['tasker-search'] }),
        queryClient.invalidateQueries({ queryKey: ['tasker-profile'] }),
      ]);
      setSaveError(null);
      setSaveState('saved');
    },
    onError: (error) => {
      setSaveError(error instanceof Error ? error.message : 'Impossible d’enregistrer la description.');
      setSaveState('error');
    },
    onSettled: () => {
      inFlightBioRef.current = null;
    },
  });

  const flushBio = React.useCallback(() => {
    if (!profile?.id || !initializedRef.current) {
      return;
    }

    const nextBio = bioDraft.trim();

    if (nextBio === lastSavedBioRef.current || inFlightBioRef.current === nextBio) {
      return;
    }

    inFlightBioRef.current = nextBio;
    setSaveState('saving');
    setSaveError(null);
    saveBioMutation.mutate(nextBio);
  }, [bioDraft, profile?.id, saveBioMutation]);

  React.useEffect(() => {
    if (!providerProfileQuery.data || initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    lastSavedBioRef.current = providerProfileQuery.data.bio;
    setBioDraft(providerProfileQuery.data.bio);
  }, [providerProfileQuery.data]);

  React.useEffect(() => {
    if (!initializedRef.current) {
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const nextBio = bioDraft.trim();

    if (nextBio === lastSavedBioRef.current) {
      if (saveState === 'pending') {
        setSaveState('idle');
      }

      return;
    }

    setSaveState('pending');
    debounceRef.current = setTimeout(() => {
      flushBio();
    }, 5000);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [bioDraft, flushBio, saveState]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        flushBio();
      };
    }, [flushBio]),
  );

  if (profile?.role !== 'provider') {
    return <Redirect href="/profile" />;
  }

  const remainingCharacters = PROVIDER_BIO_MAX_LENGTH - bioDraft.length;
  const statusLabel =
    saveState === 'saving'
      ? 'Sauvegarde...'
      : saveState === 'pending'
        ? 'Enregistrement automatique dans 5 s'
        : saveState === 'saved'
          ? 'Description enregistrée'
          : saveState === 'error'
            ? saveError ?? 'Impossible d’enregistrer la description.'
            : '';

  return (
    <View className="flex-1 bg-white">
      <View
        className="border-b border-brand-border bg-white px-5 pb-5"
        style={{ paddingTop: insets.top + 12 }}
      >
        <UIText className="text-[24px] font-semibold">Mes services</UIText>
        <MutedText className="mt-2 text-base">
          Gérez vos catégories, vos tarifs et votre visibilité dans la recherche.
        </MutedText>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="gap-6 px-5 pb-10 pt-6">
        <View className="gap-3">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <UIText className="text-base font-semibold">Description</UIText>
              <MutedText className="mt-1 text-sm leading-6">
                Présentez votre expérience, vos spécialités et votre façon de travailler.
              </MutedText>
            </View>
            <UIText className="text-xs font-semibold text-brand-ink-soft">
              {remainingCharacters}/{PROVIDER_BIO_MAX_LENGTH}
            </UIText>
          </View>

          <Input
            className="min-h-[150px] rounded-[28px] px-4 py-4 text-base leading-6"
            maxLength={PROVIDER_BIO_MAX_LENGTH}
            multiline
            onChangeText={setBioDraft}
            placeholder="Exemple : interventions rapides, expérience, zones couvertes, outils disponibles..."
            textAlignVertical="top"
            value={bioDraft}
          />

          {statusLabel ? (
            <MutedText
              className={`text-xs leading-5 ${
                saveState === 'error' ? 'text-brand-danger' : 'text-brand-ink-soft'
              }`}
            >
              {statusLabel}
            </MutedText>
          ) : null}
        </View>

        <ProviderServicesManager providerId={profile.id} />
      </ScrollView>
    </View>
  );
}
