import { useQuery } from "@tanstack/react-query";
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
  const [query, setQuery] = React.useState("");
  const categoryId = useSearchFiltersStore((state) => state.categoryId);
  const maxPrice = useSearchFiltersStore((state) => state.maxPrice);
  const minPrice = useSearchFiltersStore((state) => state.minPrice);
  const minRating = useSearchFiltersStore((state) => state.minRating);

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

  return (
    <View className="flex-1 bg-brand-sand">
      <FlatList
        contentContainerStyle={{
          gap: 20,
          paddingBottom: 32,
          paddingHorizontal: 20,
          paddingTop: 20
        }}
        contentInsetAdjustmentBehavior="automatic"
        data={searchQuery.data ?? []}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          searchQuery.isLoading ? (
            <View className="items-center gap-4 py-10">
              <Spinner size="large" />
              <MutedText>Loading services...</MutedText>
            </View>
          ) : (
            <View className="rounded-[28px] bg-brand-card p-6">
              <Heading className="text-2xl">No matching services</Heading>
              <MutedText className="mt-3 text-base leading-7">
                Try widening the budget, lowering the minimum rating, or picking a
                different category.
              </MutedText>
            </View>
          )
        }
        ListHeaderComponent={
          <View className="gap-5">
            <View className="gap-3">
              <Heading>Search services</Heading>
              <MutedText className="text-base leading-7">
                Find active offers by keyword, category, price range, and rating.
              </MutedText>
            </View>

            <Input
              autoCapitalize="none"
              onChangeText={setQuery}
              placeholder="Search plumbing, cleaning, moving..."
              value={query}
            />

            <SearchFilters categories={categoriesQuery.data ?? []} />

            <UIText className="text-sm text-brand-ink-soft">
              Results refresh 400ms after you stop typing, and filters refresh
              immediately.
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
            <ServiceCard service={item} variant="list" />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
