import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { MutedText, UIText } from '@/components/ui/text';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { listTaskBookings } from '@/features/services/api/list-task-bookings';
import { getBookingBadge, isBookingPast } from '@/features/services/lib/booking-status';
import { formatBookingDateTime, formatHourlyRateLabel } from '@/features/services/lib/formatters';
import { Pressable, ScrollView, View } from '@/tw';
import { Image } from '@/tw/image';

export default function BookingsRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useAuthSession();
  const isProvider = profile?.role === 'provider';
  const bookingsQuery = useQuery({
    enabled: Boolean(profile?.id),
    queryFn: () => listTaskBookings(profile?.id ?? '', { asProvider: isProvider }),
    queryKey: ['task-bookings', profile?.id, isProvider ? 'provider' : 'client'],
  });

  return (
    <View className="flex-1 bg-white">
      <View
        className="border-b border-brand-border bg-white px-5 pb-5"
        style={{ paddingTop: insets.top + 12 }}
      >
        <UIText className="text-[24px] font-semibold">Réservations</UIText>
        <MutedText className="mt-2 text-base">
          {isProvider
            ? 'Vos missions confirmées et rendez-vous clients apparaissent ici.'
            : 'Vos confirmations et rendez-vous à venir apparaissent ici.'}
        </MutedText>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-10 pt-6">
        {bookingsQuery.isLoading ? (
          <View className="items-center py-16">
            <Spinner size="large" />
          </View>
        ) : bookingsQuery.data?.length ? (
          <View className="gap-4">
            {bookingsQuery.data.map((booking) => {
              const bookingPast = isBookingPast(booking.scheduled_for);
              const bookingBadge = getBookingBadge(booking.status, booking.scheduled_for);
              const ratingLabel = isProvider ? 'Note client' : 'Votre note';

              return (
                <View key={booking.id} className="rounded-[28px] border border-brand-border p-5">
                  <Pressable
                    accessibilityLabel={`Voir la réservation ${booking.category.name}`}
                    onPress={() => router.push(`/bookings/${booking.id}`)}
                  >
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
                        <UIText className="text-[20px] font-semibold">
                          {booking.category.name}
                        </UIText>
                        <MutedText className="text-sm">
                          {isProvider
                            ? 'Mission réservée par un client EliteForce'
                            : booking.provider.full_name}
                        </MutedText>
                      </View>
                      <View
                        className={`rounded-full px-3 py-1.5 ${bookingBadge.containerClassName}`}
                      >
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
                        <MaterialCommunityIcons
                          color="#111827"
                          name="map-marker-outline"
                          size={18}
                        />
                        <UIText className="flex-1 text-base">{booking.address}</UIText>
                      </View>
                      <View className="flex-row items-center gap-3">
                        <MaterialCommunityIcons color="#111827" name="cash" size={18} />
                        <UIText className="text-base">
                          {formatHourlyRateLabel(booking.hourly_rate)}
                        </UIText>
                      </View>
                      {booking.notes ? (
                        <MutedText className="text-sm leading-6">{booking.notes}</MutedText>
                      ) : null}

                      {booking.client_rating !== null ? (
                        <View className="flex-row items-center gap-2">
                          <MaterialCommunityIcons color="#F59E0B" name="star" size={18} />
                          <UIText className="text-sm font-semibold">
                            {ratingLabel} : {booking.client_rating.toFixed(1)} / 5
                          </UIText>
                        </View>
                      ) : bookingPast && booking.status !== 'cancelled' ? (
                        <MutedText className="text-sm">{ratingLabel} : en attente</MutedText>
                      ) : null}
                    </View>
                  </Pressable>

                  <Button
                    className="mt-4 w-full"
                    onPress={() => router.push(`/bookings/${booking.id}`)}
                    variant="secondary"
                  >
                    Voir le détail
                  </Button>
                </View>
              );
            })}
          </View>
        ) : (
          <View className="items-center gap-4 py-20">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-sand-strong">
              <MaterialCommunityIcons color="#A3A3A3" name="calendar-clock-outline" size={28} />
            </View>
            <UIText className="text-lg font-semibold">Aucune réservation</UIText>
            <MutedText className="text-center text-sm leading-5">
              {isProvider
                ? 'Les demandes confirmées par vos clients apparaîtront ici.'
                : 'Vos rendez-vous et confirmations apparaîtront ici.'}
            </MutedText>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
