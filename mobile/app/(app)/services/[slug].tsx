import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Heading, MutedText, UIText } from "@/components/ui/text";
import { getProviderServiceDetail } from "@/features/services/api/get-provider-service-detail";
import {
  formatHourlyRate,
  formatJoinDate,
  formatReviewDate
} from "@/features/services/lib/formatters";
import { Image } from "@/tw/image";
import { ScrollView, View } from "@/tw";

export default function ServiceDetailRoute() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const detailQuery = useQuery({
    enabled: Boolean(slug),
    queryFn: () => getProviderServiceDetail(slug),
    queryKey: ["service-detail", slug]
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerShown: true,
          headerStyle: { backgroundColor: "#f6efe4" },
          headerTintColor: "#182328",
          title: "Service"
        }}
      />

      <ScrollView
        className="flex-1 bg-brand-sand"
        contentContainerClassName="gap-6 px-5 pb-10 pt-6"
        contentInsetAdjustmentBehavior="automatic"
      >
        {detailQuery.isLoading ? (
          <View className="items-center gap-4 py-16">
            <Spinner size="large" />
            <MutedText>Chargement de la fiche service...</MutedText>
          </View>
        ) : detailQuery.data ? (
          <>
            <View className="overflow-hidden rounded-[32px] bg-brand-card shadow-[0_12px_32px_rgba(24,35,40,0.08)]">
              <Image
                cachePolicy="memory-disk"
                className="h-60 w-full"
                contentFit="cover"
                source={
                  detailQuery.data.cover_image_url ??
                  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
                }
              />
              <View className="gap-4 p-6">
                <View className="gap-2">
                  <MutedText className="text-xs uppercase tracking-[1.5px] text-brand-clay">
                    {detailQuery.data.category.name}
                  </MutedText>
                  <Heading className="text-[30px] leading-9">
                    {detailQuery.data.title}
                  </Heading>
                  <MutedText className="text-base leading-7">
                    {detailQuery.data.short_description}
                  </MutedText>
                </View>

                <View className="flex-row items-center justify-between gap-3">
                  <UIText className="text-xl font-semibold text-brand-clay">
                    {formatHourlyRate(detailQuery.data.hourly_rate)}
                  </UIText>
                  <MutedText className="text-sm">
                    {detailQuery.data.rating.toFixed(1)} ({detailQuery.data.review_count} avis)
                  </MutedText>
                </View>
              </View>
            </View>

            <View className="gap-4 rounded-[32px] bg-brand-card p-6 shadow-[0_12px_32px_rgba(24,35,40,0.08)]">
              <UIText className="text-lg font-semibold">Prestataire</UIText>
              <View className="flex-row gap-4">
                <Image
                  className="h-20 w-20 rounded-[24px]"
                  contentFit="cover"
                  source={
                    detailQuery.data.provider.avatar_url ??
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
                  }
                />
                <View className="flex-1 gap-1">
                  <UIText className="text-lg font-semibold">
                    {detailQuery.data.provider.full_name}
                  </UIText>
                  <MutedText className="text-sm">
                    {detailQuery.data.provider.headline}
                  </MutedText>
                  <MutedText className="text-sm">
                    Note {detailQuery.data.provider.rating.toFixed(1)} •{" "}
                    {detailQuery.data.provider.completed_missions_count} missions
                  </MutedText>
                  <MutedText className="text-sm">
                    Inscrit depuis {formatJoinDate(detailQuery.data.provider.member_since)}
                  </MutedText>
                </View>
              </View>
              <MutedText className="text-sm leading-7">
                {detailQuery.data.provider.bio}
              </MutedText>
            </View>

            <View className="gap-3 rounded-[32px] bg-brand-card p-6 shadow-[0_12px_32px_rgba(24,35,40,0.08)]">
              <UIText className="text-lg font-semibold">Description</UIText>
              <MutedText className="text-base leading-7">
                {detailQuery.data.description}
              </MutedText>
            </View>

            <View className="gap-4 rounded-[32px] bg-brand-card p-6 shadow-[0_12px_32px_rgba(24,35,40,0.08)]">
              <View className="gap-1">
                <UIText className="text-lg font-semibold">Avis</UIText>
                <MutedText className="text-sm">
                  Retour d experience des derniers clients.
                </MutedText>
              </View>

              {detailQuery.data.reviews.length ? (
                detailQuery.data.reviews.map((review) => (
                  <View
                    key={review.id}
                    className="gap-2 rounded-[24px] border border-brand-border bg-white p-4"
                  >
                    <View className="flex-row items-center justify-between gap-3">
                      <UIText className="font-semibold">{review.author_name}</UIText>
                      <MutedText className="text-sm">
                        {review.rating.toFixed(1)} • {formatReviewDate(review.created_at)}
                      </MutedText>
                    </View>
                    <MutedText className="text-sm leading-6">
                      {review.comment}
                    </MutedText>
                  </View>
                ))
              ) : (
                <MutedText className="text-sm">
                  Aucun avis n&apos;est encore disponible pour cette prestation.
                </MutedText>
              )}
            </View>

            <Button disabled variant="ghost">
              Reservation bientot disponible
            </Button>
          </>
        ) : (
          <View className="rounded-[28px] bg-brand-card p-6">
            <Heading className="text-2xl">Service introuvable</Heading>
            <MutedText className="mt-3 text-base leading-7">
              Cette fiche n&apos;est plus disponible ou a ete retiree de la marketplace.
            </MutedText>
          </View>
        )}
      </ScrollView>
    </>
  );
}
