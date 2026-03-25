import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MutedText, UIText } from '@/components/ui/text';
import { updateDefaultAddress } from '@/features/auth/api/update-default-address';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { getSavedAddress } from '@/features/services/lib/address';
import { useAddressHistoryStore } from '@/store/address-history-store';
import { Pressable, ScrollView, View } from '@/tw';

export default function SearchAddressRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { categoryId, next } = useLocalSearchParams<{ categoryId?: string; next?: string }>();
  const { profile } = useAuthSession();
  const recentAddresses = useAddressHistoryStore((state) => state.recentAddresses);
  const addRecentAddress = useAddressHistoryStore((state) => state.addRecentAddress);
  const savedAddress = getSavedAddress(profile);
  const [address, setAddress] = React.useState(savedAddress?.label ?? '');
  const [details, setDetails] = React.useState(savedAddress?.details ?? '');

  const mutation = useMutation({
    mutationFn: async () => {
      if (!profile) {
        throw new Error('Session manquante.');
      }

      return updateDefaultAddress(profile.id, {
        defaultAddress: address,
        defaultAddressDetails: details,
      });
    },
    onSuccess: async (updatedProfile) => {
      addRecentAddress({
        details,
        label: address,
      });
      queryClient.setQueryData(['profile', profile?.id], updatedProfile);
      await queryClient.invalidateQueries({ queryKey: ['profile', profile?.id] });

      if (next === 'confirm' && categoryId) {
        router.replace({
          pathname: '/search/confirm',
          params: { categoryId },
        });
        return;
      }

      router.replace('/');
    },
  });

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
            onPress={() => router.back()}
            size={36}
          />
          <View className="flex-1 items-center">
            <UIText className="text-[20px] font-semibold">Adresse</UIText>
          </View>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-8"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mt-8 gap-6">
            <View className="gap-2">
              <UIText className="text-[15px]">Adresse postale</UIText>
              <Input
                onChangeText={setAddress}
                placeholder="8 Rue au Pain, 78000 Versailles, France"
                value={address}
              />
            </View>

            <View className="gap-2">
              <UIText className="text-[15px]">Facultatif : n° du logement</UIText>
              <Input
                onChangeText={setDetails}
                placeholder="Appartement, etage, code..."
                value={details}
              />
            </View>
          </View>

          {recentAddresses.length ? (
            <View className="mt-8">
              <UIText className="mb-3 text-[16px] font-semibold text-brand-clay">Récent</UIText>
              <View className="overflow-hidden rounded-2xl border border-brand-border">
                {recentAddresses.map((item) => (
                  <Pressable
                    key={`${item.label}-${item.details}`}
                    className="border-b border-brand-border px-4 py-4 last:border-b-0"
                    onPress={() => {
                      setAddress(item.label);
                      setDetails(item.details);
                    }}
                  >
                    <UIText className="text-[16px] leading-6">{item.label}</UIText>
                    {item.details ? (
                      <MutedText className="mt-1 text-sm">{item.details}</MutedText>
                    ) : null}
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>

        <View
          className="border-t border-brand-border bg-white px-5 pt-4"
          style={{ paddingBottom: Math.max(insets.bottom, 24) }}
        >
          <Button
            disabled={!address.trim()}
            loading={mutation.isPending}
            onPress={() => mutation.mutate()}
          >
            Enregistrer
          </Button>

          {mutation.error instanceof Error ? (
            <MutedText className="mt-3 text-center text-sm text-brand-danger">
              {mutation.error.message}
            </MutedText>
          ) : null}
        </View>
      </View>
    </>
  );
}
