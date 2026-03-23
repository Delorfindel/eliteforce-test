import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { FlatList, RefreshControl } from "react-native";

import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Heading, MutedText, UIText } from "@/components/ui/text";
import { listCategories } from "@/features/services/api/list-categories";
import { SearchFilters } from "@/features/services/components/search-filters";
import { ServiceCard } from "@/features/services/components/service-card";
import { useServicesSearch } from "@/features/services/hooks/use-services-search";
import { useSearchFiltersStore } from "@/store/search-filters-store";
import { View } from "@/tw";

export default function SearchRoute() {
  const router = useRouter();
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
    if (!params.categoryId) {
      return;
    }

    const nextCategoryId = Number(params.categoryId);

    if (!Number.isNaN(nextCategoryId)) {
      setCategoryId(nextCategoryId);
    }
  }, [params.categoryId, setCategoryId]);

  return (
    <View className="flex-1 bg-brand-sand">
      <FlatList
        contentContainerStyle={{
          gap: 16,
          paddingBottom: 32,
          paddingHorizontal: 16,
          paddingTop: 12
        }}
        contentInsetAdjustmentBehavior="automatic"
        data={searchQuery.data ?? []}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          searchQuery.isLoading ? (
            <View className="items-center gap-4 py-10">
              <Spinner size="large" />
              <MutedText>Chargement des prestations...</MutedText>
            </View>
          ) : (
            <View className="rounded-[28px] bg-brand-card p-6">
              <Heading className="text-2xl">Aucune prestation correspondante</Heading>
              <MutedText className="mt-3 text-base leading-7">
                Essayez d&apos;élargir le budget, de baisser la note minimale ou de
                changer de catégorie.
              </MutedText>
            </View>
          )
        }
        ListHeaderComponent={
          <View className="gap-3">
            <Input
              autoCapitalize="none"
              onChangeText={setQuery}
              placeholder="Plomberie, montage de meuble, ménage..."
              value={query}
            />

            <SearchFilters categories={categoriesQuery.data ?? []} />

            <View className="gap-1 pt-1">
              <Heading className="text-[30px] leading-9">Recherche</Heading>
              <MutedText className="text-sm leading-6" numberOfLines={1}>
                Trouvez rapidement une prestation active par mot-clé, catégorie,
                budget ou note.
              </MutedText>
            </View>

            <UIText className="text-xs text-brand-ink-soft">
              Les résultats se mettent à jour 400 ms après la saisie, les filtres
              s&apos;appliquent immédiatement.
            </UIText>
          </View>
        }
        refreshControl={
          <RefreshControl
            onRefresh={() => searchQuery.refetch()}
            refreshing={searchQuery.isRefetching}
            tintColor="#b2502d"
          />
        }
        renderItem={({ item }) => (
          <View className="mb-4">
            <ServiceCard
              onPress={() => router.push(`/services/${item.slug}`)}
              service={item}
              variant="list"
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
