import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList } from "react-native";

import { Button } from "@/components/ui/button";
import { Heading, MutedText, UIText } from "@/components/ui/text";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { listCategories } from "@/features/services/api/list-categories";
import { listTopProviderServices } from "@/features/services/api/list-top-provider-services";
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
  const topServicesQuery = useQuery({
    queryFn: listTopProviderServices,
    queryKey: ["top-provider-services"]
  });

  return (
    <ScrollView
      className="flex-1 bg-brand-sand"
      contentContainerClassName="gap-6 px-5 pb-10 pt-6"
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="gap-3">
        <MutedText className="text-sm uppercase tracking-[2px] text-brand-clay">
          Marketplace de prestations
        </MutedText>
        <Heading>{`Bienvenue${profile?.first_name ? `, ${profile.first_name}` : ""}`}</Heading>
        <MutedText className="text-base leading-7">
          Trouve un prestataire fiable pour les travaux du quotidien.
        </MutedText>
      </View>

      <Pressable
        className="rounded-[28px] border border-brand-border bg-brand-card px-5 py-4"
        onPress={() => router.push("/search")}
      >
        <MutedText className="text-base">
          Rechercher une prestation, une categorie ou un budget
        </MutedText>
      </Pressable>

      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <UIText className="text-lg font-semibold">Categories</UIText>
          <Button className="min-h-10 px-4" onPress={() => router.push("/search")} variant="ghost">
            Tout voir
          </Button>
        </View>
        <CategoryGrid
          categories={categoriesQuery.data ?? []}
          onSelectCategory={(category) =>
            router.push({
              pathname: "/search",
              params: { categoryId: String(category.id) }
            })
          }
        />
      </View>

      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <UIText className="text-lg font-semibold">Top services</UIText>
          <MutedText className="text-sm">Les mieux notes du moment</MutedText>
        </View>
        <FlatList
          data={topServicesQuery.data ?? []}
          horizontal
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View className="mr-4">
              <ServiceCard
                onPress={() => router.push(`/services/${item.slug}`)}
                service={item}
                variant="featured"
              />
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
}
