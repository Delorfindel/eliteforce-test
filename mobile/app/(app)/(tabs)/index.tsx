import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList } from "react-native";

import { Button } from "@/components/ui/button";
import { Heading, MutedText, UIText } from "@/components/ui/text";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { listCategories } from "@/features/services/api/list-categories";
import { listFeaturedServices } from "@/features/services/api/list-featured-services";
import { CategoryGrid } from "@/features/services/components/category-grid";
import { ServiceCard } from "@/features/services/components/service-card";
import { Pressable, ScrollView, View } from "@/tw";

export default function HomeRoute() {
  const router = useRouter();
  const { profile } = useAuthSession();
  const categoriesQuery = useQuery({
    queryFn: listCategories,
    queryKey: ["service-categories"]
  });
  const featuredQuery = useQuery({
    queryFn: listFeaturedServices,
    queryKey: ["featured-services"]
  });

  return (
    <ScrollView
      className="flex-1 bg-brand-sand"
      contentContainerClassName="gap-6 px-5 pb-10 pt-6"
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="gap-3">
        <MutedText className="text-sm uppercase tracking-[2px] text-brand-clay">
          Home services marketplace
        </MutedText>
        <Heading>{`Welcome${profile?.first_name ? `, ${profile.first_name}` : ""}`}</Heading>
        <MutedText className="text-base leading-7">
          Explore trusted help for the tasks that keep your home running.
        </MutedText>
      </View>

      <Pressable
        className="rounded-[28px] border border-brand-border bg-brand-card px-5 py-4"
        onPress={() => router.push("/search")}
      >
        <MutedText className="text-base">
          Search by service, category, or budget
        </MutedText>
      </Pressable>

      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <UIText className="text-lg font-semibold">Popular categories</UIText>
          <Button className="min-h-10 px-4" onPress={() => router.push("/search")} variant="ghost">
            View all
          </Button>
        </View>
        <CategoryGrid categories={categoriesQuery.data ?? []} />
      </View>

      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <UIText className="text-lg font-semibold">Featured services</UIText>
          <MutedText className="text-sm">Top-rated this week</MutedText>
        </View>
        <FlatList
          data={featuredQuery.data ?? []}
          horizontal
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View className="mr-4">
              <ServiceCard service={item} variant="featured" />
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
}
