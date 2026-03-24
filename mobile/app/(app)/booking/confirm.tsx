import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { MutedText, UIText } from '@/components/ui/text';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { createTaskBooking } from '@/features/services/api/create-task-booking';
import { getTaskerProfile } from '@/features/services/api/get-tasker-profile';
import { getSavedAddress } from '@/features/services/lib/address';
import {
  formatBookingDate,
  formatBookingTime,
  formatHourlyRateLabel,
} from '@/features/services/lib/formatters';
import { useBookingFlowStore } from '@/store/booking-flow-store';
import { ScrollView, View } from '@/tw';
import { Image } from '@/tw/image';

export default function BookingConfirmRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { profile } = useAuthSession();
  const categoryId = useBookingFlowStore((state) => state.categoryId);
  const notes = useBookingFlowStore((state) => state.notes);
  const offeringId = useBookingFlowStore((state) => state.offeringId);
  const providerId = useBookingFlowStore((state) => state.providerId);
  const scheduledFor = useBookingFlowStore((state) => state.scheduledFor);
  const reset = useBookingFlowStore((state) => state.reset);
  const taskerQuery = useQuery({
    enabled: Boolean(offeringId),
    queryFn: () => getTaskerProfile(Number(offeringId)),
    queryKey: ['tasker-profile', offeringId],
  });

  const savedAddress = getSavedAddress(profile);

  const bookingMutation = useMutation({
    mutationFn: async () => {
      if (
        !profile ||
        !taskerQuery.data ||
        !savedAddress ||
        !categoryId ||
        !offeringId ||
        !providerId ||
        !scheduledFor
      ) {
        throw new Error('Informations manquantes pour confirmer la réservation.');
      }

      return createTaskBooking({
        address: savedAddress.label,
        addressDetails: savedAddress.details,
        categoryId,
        clientId: profile.id,
        hourlyRate: taskerQuery.data.hourly_rate,
        notes,
        offeringId,
        providerId,
        scheduledFor,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['task-bookings', profile?.id] });
      reset();
      router.replace('/bookings');
    },
  });

  const tasker = taskerQuery.data;

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
            <UIText className="text-[20px] font-semibold">Vérification et confirmation</UIText>
          </View>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1" contentContainerClassName="px-5 pb-8">
          {tasker && scheduledFor ? (
            <View className="gap-6 pt-8">
              <View className="flex-row items-start justify-between gap-4">
                <View className="flex-1 gap-2">
                  <UIText className="text-[20px] font-semibold">{tasker.category.name}</UIText>
                  <View className="flex-row items-center gap-3">
                    <MaterialCommunityIcons
                      color="#111827"
                      name="calendar-blank-outline"
                      size={22}
                    />
                    <UIText className="text-[17px]">{formatBookingDate(scheduledFor)}</UIText>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <MaterialCommunityIcons color="#111827" name="clock-outline" size={22} />
                    <UIText className="text-[17px]">{formatBookingTime(scheduledFor)} CET</UIText>
                  </View>
                </View>

                <View className="items-center gap-2">
                  <Image
                    className="h-20 w-20 rounded-full bg-brand-sand-strong"
                    contentFit="cover"
                    source={
                      tasker.provider.avatar_url ??
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
                    }
                  />
                  <UIText className="text-sm">{tasker.provider.full_name}</UIText>
                </View>
              </View>

              <View className="border-y border-brand-border py-6">
                <View className="flex-row items-center justify-between">
                  <UIText className="text-[20px] font-semibold">Paiement</UIText>
                  <MutedText className="text-[16px]">Placeholder</MutedText>
                </View>
                <MutedText className="mt-3 text-base leading-7">
                  Apple Pay et les cartes seront ajoutés ici lors de l’intégration paiement.
                </MutedText>
              </View>

              <View className="border-b border-brand-border pb-6">
                <View className="flex-row items-center justify-between">
                  <UIText className="text-[20px] font-semibold">Taux horaire</UIText>
                  <UIText className="text-[20px] font-semibold">
                    {formatHourlyRateLabel(tasker.hourly_rate)}
                  </UIText>
                </View>
              </View>

              <MutedText className="text-base leading-8">
                Une retenue provisoire peut apparaître sur votre moyen de paiement. Pour l’instant,
                aucun débit n’est effectué dans cette version.
              </MutedText>

              <MutedText className="text-base leading-8">
                Le prix inclut les frais de confiance et la TVA. Les détails légaux et les
                conditions d’annulation seront finalisés avec l’intégration paiement.
              </MutedText>

              {savedAddress ? (
                <View className="rounded-[24px] bg-brand-sand p-5">
                  <UIText className="text-base font-semibold">Adresse</UIText>
                  <UIText className="mt-2 text-base leading-7">{savedAddress.label}</UIText>
                  {savedAddress.details ? (
                    <MutedText className="mt-1 text-sm">{savedAddress.details}</MutedText>
                  ) : null}
                </View>
              ) : null}
            </View>
          ) : null}
        </ScrollView>

        <View
          className="border-t border-brand-border bg-white px-5 pt-4"
          style={{ paddingBottom: Math.max(insets.bottom, 24) }}
        >
          <Button
            disabled={!tasker || !scheduledFor || !savedAddress}
            loading={bookingMutation.isPending}
            onPress={() => bookingMutation.mutate()}
          >
            Confirmer et discuter
          </Button>
        </View>
      </View>
    </>
  );
}
