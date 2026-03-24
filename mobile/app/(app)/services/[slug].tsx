import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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

  const data = detailQuery.data;

  return (
    <>
      <Stack.Screen
        options={{
          headerBackTitle: "Retour",
          headerShadowVisible: false,
          headerShown: true,
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTintColor: "#0A0A0A",
          title: ""
        }}
      />

      <ScrollView
        className="flex-1 bg-brand-sand"
        contentContainerClassName="pb-10"
        contentInsetAdjustmentBehavior="automatic"
      >
        {detailQuery.isLoading ? (
          <View className="items-center py-20">
            <Spinner size="large" />
          </View>
        ) : data ? (
          <>
            <Image
              cachePolicy="memory-disk"
              className="h-64 w-full"
              contentFit="cover"
              source={
                data.cover_image_url ??
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
              }
            />

            <View className="gap-6 px-5 pt-5">
              <View className="gap-3">
                <View className="flex-row items-center gap-2">
                  <View className="rounded-full bg-brand-accent-light px-3 py-1">
                    <UIText className="text-xs font-semibold text-brand-clay">
                      {data.category.name}
                    </UIText>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MaterialCommunityIcons color="#F59E0B" name="star" size={14} />
                    <UIText className="text-sm font-semibold text-brand-ink">
                      {data.rating.toFixed(1)}
                    </UIText>
                    <MutedText className="text-sm">
                      ({data.review_count} avis)
                    </MutedText>
                  </View>
                </View>

                <Heading className="text-2xl">{data.title}</Heading>

                <MutedText className="text-base leading-6">
                  {data.short_description}
                </MutedText>

                <UIText className="text-2xl font-bold text-brand-clay">
                  {formatHourlyRate(data.hourly_rate)}
                </UIText>
              </View>

              <View className="h-px bg-brand-border" />

              <View className="flex-row items-center gap-4">
                <Image
                  className="h-14 w-14 rounded-full"
                  contentFit="cover"
                  source={
                    data.provider.avatar_url ??
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
                  }
                />
                <View className="flex-1 gap-0.5">
                  <UIText className="text-base font-semibold">
                    {data.provider.full_name}
                  </UIText>
                  <MutedText className="text-sm">
                    {data.provider.headline}
                  </MutedText>
                  <View className="flex-row items-center gap-2 pt-0.5">
                    <View className="flex-row items-center gap-1">
                      <MaterialCommunityIcons color="#F59E0B" name="star" size={12} />
                      <UIText className="text-xs font-semibold">
                        {data.provider.rating.toFixed(1)}
                      </UIText>
                    </View>
                    <MutedText className="text-xs">•</MutedText>
                    <MutedText className="text-xs">
                      {data.provider.completed_missions_count} missions
                    </MutedText>
                    <MutedText className="text-xs">•</MutedText>
                    <MutedText className="text-xs">
                      Depuis {formatJoinDate(data.provider.member_since)}
                    </MutedText>
                  </View>
                </View>
              </View>

              {data.provider.bio ? (
                <>
                  <View className="h-px bg-brand-border" />
                  <View className="gap-2">
                    <UIText className="text-base font-semibold">À propos</UIText>
                    <MutedText className="text-sm leading-6">
                      {data.provider.bio}
                    </MutedText>
                  </View>
                </>
              ) : null}

              <View className="h-px bg-brand-border" />

              <View className="gap-2">
                <UIText className="text-base font-semibold">Description</UIText>
                <MutedText className="text-sm leading-6">
                  {data.description}
                </MutedText>
              </View>

              {data.reviews.length ? (
                <>
                  <View className="h-px bg-brand-border" />
                  <View className="gap-4">
                    <UIText className="text-base font-semibold">
                      Avis ({data.reviews.length})
                    </UIText>
                    {data.reviews.map((review) => (
                      <View
                        key={review.id}
                        className="gap-2 rounded-xl bg-brand-card p-4"
                      >
                        <View className="flex-row items-center justify-between">
                          <UIText className="text-sm font-semibold">{review.author_name}</UIText>
                          <View className="flex-row items-center gap-1">
                            <MaterialCommunityIcons color="#F59E0B" name="star" size={12} />
                            <UIText className="text-xs font-semibold">{review.rating.toFixed(1)}</UIText>
                            <MutedText className="text-xs">
                              • {formatReviewDate(review.created_at)}
                            </MutedText>
                          </View>
                        </View>
                        <MutedText className="text-sm leading-5">
                          {review.comment}
                        </MutedText>
                      </View>
                    ))}
                  </View>
                </>
              ) : null}

              <Button disabled variant="primary">
                Réserver — bientôt disponible
              </Button>
            </View>
          </>
        ) : (
          <View className="items-center gap-2 px-5 py-20">
            <UIText className="text-lg font-semibold">Service introuvable</UIText>
            <MutedText className="text-center text-sm">
              Cette fiche n&apos;est plus disponible.
            </MutedText>
          </View>
        )}
      </ScrollView>
    </>
  );
}
