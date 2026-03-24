import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { MutedText, UIText } from '@/components/ui/text';
import { getTaskerProfile } from '@/features/services/api/get-tasker-profile';
import { SchedulingSheet } from '@/features/services/components/scheduling-sheet';
import { formatHourlyRateLabel, formatReviewDate } from '@/features/services/lib/formatters';
import { useBookingFlowStore } from '@/store/booking-flow-store';
import { ScrollView, View } from '@/tw';
import { Image } from '@/tw/image';

export default function TaskerProfileRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { offeringId } = useLocalSearchParams<{ offeringId: string }>();
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const setSelection = useBookingFlowStore((state) => state.setSelection);
  const setSchedule = useBookingFlowStore((state) => state.setSchedule);

  const taskerQuery = useQuery({
    enabled: Boolean(offeringId),
    queryFn: () => getTaskerProfile(Number(offeringId)),
    queryKey: ['tasker-profile', offeringId],
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
            <UIText className="text-[20px] font-semibold">Profil du Tasker</UIText>
          </View>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1" contentContainerClassName="px-5 pb-32 pt-6">
          {taskerQuery.isLoading ? (
            <View className="items-center py-20">
              <Spinner size="large" />
            </View>
          ) : tasker ? (
            <View className="gap-8">
              <View className="flex-row items-center gap-5">
                <Image
                  className="h-28 w-28 rounded-full bg-brand-sand-strong"
                  contentFit="cover"
                  source={
                    tasker.provider.avatar_url ??
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
                  }
                />
                <View className="flex-1 gap-2">
                  <UIText className="text-[28px] font-semibold">{tasker.provider.full_name}</UIText>
                  <View className="flex-row items-center gap-2">
                    <MaterialCommunityIcons color="#111827" name="star" size={20} />
                    <UIText className="text-[16px]">
                      {tasker.provider.rating.toFixed(1)} ({tasker.provider.review_count} avis)
                    </UIText>
                  </View>
                </View>
              </View>

              <View className="gap-4 border-b border-brand-border pb-6">
                <View className="flex-row items-start gap-3">
                  <MaterialCommunityIcons color="#111827" name="check-decagram" size={22} />
                  <View className="flex-1">
                    <UIText className="text-[16px] font-semibold">
                      {tasker.category.name} : {tasker.completed_task_count} tasks
                    </UIText>
                    <MutedText className="text-[15px]">
                      {tasker.provider.completed_missions_count} tasks au total
                    </MutedText>
                  </View>
                </View>

                <View className="flex-row items-start gap-3">
                  <MaterialCommunityIcons color="#111827" name="tools" size={22} />
                  <UIText className="flex-1 text-[16px]">
                    Outils : {tasker.provider.tools.join(', ') || 'Selon besoin'}
                  </UIText>
                </View>

                <View className="flex-row items-start gap-3">
                  <MaterialCommunityIcons
                    color="#111827"
                    name="chat-processing-outline"
                    size={22}
                  />
                  <UIText className="flex-1 text-[16px]">
                    Langues parlées : {tasker.provider.languages.join(', ')}
                  </UIText>
                </View>
              </View>

              <View className="gap-3">
                <UIText className="text-[20px] font-semibold">Compétences et expérience</UIText>
                <UIText className="text-[16px] leading-7">{tasker.provider.bio}</UIText>
              </View>

              <View className="gap-4">
                <UIText className="text-[20px] font-semibold">Avis récents</UIText>
                {tasker.reviews.length ? (
                  tasker.reviews.map((review) => (
                    <View key={review.id} className="rounded-[24px] bg-brand-sand p-5">
                      <View className="flex-row items-center justify-between gap-3">
                        <UIText className="text-base font-semibold">{review.author_name}</UIText>
                        <MutedText className="text-sm">
                          {formatReviewDate(review.created_at)}
                        </MutedText>
                      </View>
                      <View className="mt-2 flex-row items-center gap-2">
                        <MaterialCommunityIcons color="#111827" name="star" size={18} />
                        <UIText className="text-sm font-semibold">
                          {review.rating.toFixed(1)}
                        </UIText>
                      </View>
                      <UIText className="mt-3 text-base leading-7">{review.comment}</UIText>
                    </View>
                  ))
                ) : (
                  <MutedText className="text-base">Aucun avis public pour le moment.</MutedText>
                )}
              </View>
            </View>
          ) : (
            <View className="items-center gap-3 py-20">
              <UIText className="text-lg font-semibold">Profil introuvable</UIText>
              <MutedText className="text-center text-sm">
                Cette annonce n’est plus disponible.
              </MutedText>
            </View>
          )}
        </ScrollView>

        {tasker ? (
          <View
            className="border-t border-brand-border bg-white px-5 pb-6 pt-4"
            style={{ paddingBottom: Math.max(insets.bottom, 24) }}
          >
            <View className="mb-3 flex-row items-center justify-between">
              <MutedText className="text-sm">{tasker.category.name}</MutedText>
              <UIText className="text-base font-semibold">
                {formatHourlyRateLabel(tasker.hourly_rate)}
              </UIText>
            </View>
            <Button onPress={() => setSheetOpen(true)}>Choisir une date et une heure</Button>
          </View>
        ) : null}

        <SchedulingSheet
          onClose={() => setSheetOpen(false)}
          onConfirm={(scheduledFor) => {
            if (!tasker) {
              return;
            }

            setSelection({
              categoryId: tasker.category.id,
              offeringId: tasker.id,
              providerId: tasker.provider.profile_id,
            });
            setSchedule(scheduledFor);
            setSheetOpen(false);
            router.push('/booking/details');
          }}
          visible={sheetOpen}
        />
      </View>
    </>
  );
}
