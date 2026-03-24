import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Redirect, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { MutedText, UIText } from '@/components/ui/text';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { getTaskBooking } from '@/features/services/api/get-task-booking';
import { cancelTaskBooking, rateTaskBooking } from '@/features/services/api/update-task-booking';
import { getBookingBadge, isBookingPast } from '@/features/services/lib/booking-status';
import {
  formatBookingDateTime,
  formatHourlyRateLabel,
  formatReviewDate,
} from '@/features/services/lib/formatters';
import { Pressable, ScrollView, View } from '@/tw';
import { Image } from '@/tw/image';

const RATING_VALUES = [1, 2, 3, 4, 5] as const;

export default function BookingDetailRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const parsedBookingId = Number.parseInt(bookingId ?? '', 10);
  const { profile } = useAuthSession();
  const isClient = profile?.role === 'client';
  const bookingQueryKey = ['task-booking', parsedBookingId, profile?.id] as const;
  const [selectedRating, setSelectedRating] = React.useState(0);

  const bookingQuery = useQuery({
    enabled: Number.isFinite(parsedBookingId),
    queryFn: () => getTaskBooking(parsedBookingId),
    queryKey: bookingQueryKey,
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelTaskBooking(parsedBookingId),
    onSuccess: async (updatedBooking) => {
      queryClient.setQueryData(bookingQueryKey, updatedBooking);
      await queryClient.invalidateQueries({ queryKey: ['task-bookings', profile?.id] });
    },
  });

  const ratingMutation = useMutation({
    mutationFn: () => rateTaskBooking(parsedBookingId, selectedRating),
    onSuccess: async (updatedBooking) => {
      queryClient.setQueryData(bookingQueryKey, updatedBooking);
      await queryClient.invalidateQueries({ queryKey: ['task-bookings', profile?.id] });
    },
  });

  const booking = bookingQuery.data;
  const bookingPast = booking ? isBookingPast(booking.scheduled_for) : false;
  const hasRating = booking?.client_rating !== null && booking?.client_rating !== undefined;
  const activeRating = hasRating ? Math.round(booking.client_rating ?? 0) : selectedRating;
  const canCancel = Boolean(isClient && booking && !bookingPast && booking.status === 'confirmed');
  const canRate = Boolean(isClient && booking && bookingPast && booking.status !== 'cancelled');

  React.useEffect(() => {
    if (booking?.client_rating !== null && booking?.client_rating !== undefined) {
      setSelectedRating(Math.round(booking.client_rating));
    }
  }, [booking?.client_rating]);

  if (!Number.isFinite(parsedBookingId)) {
    return <Redirect href="/bookings" />;
  }

  const bookingBadge = booking
    ? getBookingBadge(booking.status, booking.scheduled_for)
    : getBookingBadge('confirmed', new Date().toISOString());

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
            <UIText className="text-[20px] font-semibold">Détail réservation</UIText>
          </View>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1" contentContainerClassName="px-5 pb-10 pt-6">
          {bookingQuery.isLoading ? (
            <View className="items-center py-16">
              <Spinner size="large" />
            </View>
          ) : booking ? (
            <View className="gap-5">
              <View className="rounded-[28px] border border-brand-border p-5">
                <View className="flex-row items-center gap-4">
                  <Image
                    className="h-16 w-16 rounded-full bg-brand-sand-strong"
                    contentFit="cover"
                    source={
                      booking.provider.avatar_url ??
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
                    }
                  />
                  <View className="flex-1 gap-1">
                    <UIText className="text-[20px] font-semibold">{booking.category.name}</UIText>
                    <MutedText className="text-sm">{booking.provider.full_name}</MutedText>
                  </View>
                </View>

                <View className="mt-4 flex-row flex-wrap items-center gap-2">
                  <View className={`rounded-full px-3 py-1.5 ${bookingBadge.containerClassName}`}>
                    <UIText className={`text-xs font-semibold ${bookingBadge.textClassName}`}>
                      {bookingBadge.label}
                    </UIText>
                  </View>
                </View>

                <View className="mt-5 gap-3">
                  <View className="flex-row items-center gap-3">
                    <MaterialCommunityIcons
                      color="#111827"
                      name="calendar-blank-outline"
                      size={18}
                    />
                    <UIText className="text-base">
                      {formatBookingDateTime(booking.scheduled_for)}
                    </UIText>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <MaterialCommunityIcons color="#111827" name="map-marker-outline" size={18} />
                    <UIText className="flex-1 text-base">{booking.address}</UIText>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <MaterialCommunityIcons color="#111827" name="cash" size={18} />
                    <UIText className="text-base">
                      {formatHourlyRateLabel(booking.hourly_rate)}
                    </UIText>
                  </View>
                </View>

                {booking.notes ? (
                  <View className="mt-4 rounded-2xl bg-brand-sand-strong p-4">
                    <MutedText className="text-xs font-semibold uppercase tracking-wide">
                      Notes de réservation
                    </MutedText>
                    <UIText className="mt-2 text-base leading-6">{booking.notes}</UIText>
                  </View>
                ) : null}
              </View>

              {canCancel ? (
                <View className="rounded-[28px] border border-brand-border p-5">
                  <UIText className="text-base font-semibold">Annuler ce rendez-vous</UIText>
                  <MutedText className="mt-2 text-sm leading-6">
                    Cette action mettra l’état de la réservation en “Annulée”.
                  </MutedText>

                  {cancelMutation.error ? (
                    <MutedText className="mt-3 text-sm text-brand-danger">
                      {cancelMutation.error instanceof Error
                        ? cancelMutation.error.message
                        : 'Impossible d’annuler cette réservation.'}
                    </MutedText>
                  ) : null}

                  <Button
                    className="mt-4"
                    loading={cancelMutation.isPending}
                    onPress={() =>
                      Alert.alert(
                        'Annuler la réservation ?',
                        'Le rendez-vous sera marqué comme annulé.',
                        [
                          { style: 'cancel', text: 'Retour' },
                          {
                            style: 'destructive',
                            text: 'Confirmer l’annulation',
                            onPress: () => cancelMutation.mutate(),
                          },
                        ],
                      )
                    }
                    variant="secondary"
                  >
                    Annuler le rendez-vous
                  </Button>
                </View>
              ) : null}

              {canRate ? (
                <View className="rounded-[28px] border border-brand-border p-5">
                  {hasRating ? (
                    <>
                      <UIText className="text-base font-semibold">Votre note</UIText>
                      <View className="mt-4 flex-row items-center gap-1">
                        {RATING_VALUES.map((value) => (
                          <MaterialCommunityIcons
                            key={value}
                            color={value <= activeRating ? '#F59E0B' : '#A3A3A3'}
                            name={value <= activeRating ? 'star' : 'star-outline'}
                            size={32}
                          />
                        ))}
                      </View>
                    </>
                  ) : (
                    <>
                      <UIText className="text-base font-semibold">Noter cette réservation</UIText>
                      <MutedText className="mt-2 text-sm leading-6">
                        Ajoutez une note de 1 à 5 étoiles.
                      </MutedText>
                      <View className="mt-4 flex-row items-center gap-1">
                        {RATING_VALUES.map((value) => (
                          <Pressable
                            key={value}
                            accessibilityLabel={`Noter ${value} sur 5`}
                            className="p-1"
                            disabled={ratingMutation.isPending}
                            onPress={() => setSelectedRating(value)}
                          >
                            <MaterialCommunityIcons
                              color={value <= activeRating ? '#F59E0B' : '#A3A3A3'}
                              name={value <= activeRating ? 'star' : 'star-outline'}
                              size={32}
                            />
                          </Pressable>
                        ))}
                      </View>
                      <Button
                        className="mt-4"
                        disabled={selectedRating === 0}
                        loading={ratingMutation.isPending}
                        onPress={() => ratingMutation.mutate()}
                      >
                        Enregistrer ma note
                      </Button>
                    </>
                  )}

                  {hasRating && booking.client_rating !== null ? (
                    <MutedText className="mt-3 text-sm">
                      Note enregistrée : {booking.client_rating.toFixed(1)} / 5
                      {booking.client_rated_at
                        ? ` • le ${formatReviewDate(booking.client_rated_at)}`
                        : ''}
                    </MutedText>
                  ) : null}

                  {ratingMutation.error ? (
                    <MutedText className="mt-3 text-sm text-brand-danger">
                      {ratingMutation.error instanceof Error
                        ? ratingMutation.error.message
                        : 'Impossible d’enregistrer la note.'}
                    </MutedText>
                  ) : null}
                </View>
              ) : null}
            </View>
          ) : (
            <View className="items-center gap-3 py-20">
              <UIText className="text-lg font-semibold">Réservation introuvable</UIText>
              <MutedText className="text-center text-sm">
                Cette réservation n’est plus disponible.
              </MutedText>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}
