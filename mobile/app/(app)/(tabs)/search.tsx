import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { FlatList, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { MutedText, UIText } from "@/components/ui/text";
import { listCategories } from "@/features/services/api/list-categories";
import { SearchFilters } from "@/features/services/components/search-filters";
import { ServiceCard } from "@/features/services/components/service-card";
import { useServicesSearch } from "@/features/services/hooks/use-services-search";
import { useSearchFiltersStore } from "@/store/search-filters-store";
import { View } from "@/tw";

export default function SearchRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ categoryId?: string }>();
  const [query, setQuery] = React.useState("");
  const categoryId = useSearchFiltersStore((state) => state.categoryId);
  const maxPrice = useSearchFiltersStore((state) => state.maxPrice);
  const minPrice = useSearchFiltersStore((state) => state.minPrice);
  const minRating = useSearchFiltersStore((state) => state.minRating);
  const setCategoryId = useSearchFiltersStore((state) => state.setCategoryId);

  const categoriesQuery = useQuery({
    queryFn: listCategories,
    queryKey: ["service-categories"]
  });
  const searchQuery = useServicesSearch({
    categoryId,
    maxPrice,
    minPrice,
    minRating,
    query
  });

  React.useEffect(() => {
    if (!params.categoryId) return;
    const nextCategoryId = Number(params.categoryId);
    if (!Number.isNaN(nextCategoryId)) setCategoryId(nextCategoryId);
  }, [params.categoryId, setCategoryId]);

  const resultCount = searchQuery.data?.length ?? 0;

  return (
    <View className="flex-1 bg-brand-sand">
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderBottomColor: "#E5E5E5",
          borderBottomWidth: 0.5,
          paddingTop: insets.top,
          zIndex: 10
        }}
      >
        <View className="gap-3 px-5 pb-3 pt-2">
          <Input
            autoCapitalize="none"
            className="min-h-11 text-sm bg-brand-sand-strong border-transparent"
            onChangeText={setQuery}
            placeholder="Rechercher une prestation..."
            value={query}
          />
          <SearchFilters categories={categoriesQuery.data ?? []} />
        </View>
      </View>

      <FlatList
        contentContainerStyle={{
          gap: 12,
          paddingBottom: 32,
          paddingHorizontal: 20,
          paddingTop: 16
        }}
        data={searchQuery.data ?? []}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          searchQuery.isLoading ? (
            <View className="items-center py-16">
              <Spinner size="large" />
            </View>
          ) : (
            <View className="items-center gap-2 py-16">
              <UIText className="text-lg font-semibold">Aucun résultat</UIText>
              <MutedText className="text-center text-sm">
                Ajustez vos filtres ou votre recherche.
              </MutedText>
            </View>
          )
        }
        ListHeaderComponent={
          !searchQuery.isLoading && resultCount > 0 ? (
            <MutedText className="mb-2 text-xs">
              {resultCount} prestation{resultCount > 1 ? "s" : ""} trouvée{resultCount > 1 ? "s" : ""}
            </MutedText>
          ) : null
        }
        refreshControl={
          <RefreshControl
            onRefresh={() => searchQuery.refetch()}
            refreshing={searchQuery.isRefetching}
            tintColor="#0E7051"
          />
        }
        renderItem={({ item }) => (
          <ServiceCard
            onPress={() => router.push(`/services/${item.slug}`)}
            service={item}
            variant="list"
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
