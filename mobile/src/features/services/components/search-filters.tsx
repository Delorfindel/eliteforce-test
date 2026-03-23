import React from "react";
import { FlatList } from "react-native";

import { Input } from "@/components/ui/input";
import { MutedText, UIText } from "@/components/ui/text";
import { useSearchFiltersStore } from "@/store/search-filters-store";
import { Pressable, View } from "@/tw";
import type { ServiceCategory } from "@/features/services/types";

type SearchFiltersProps = {
  categories: ServiceCategory[];
};

const ratingOptions = [0, 3, 4, 4.5];

export function SearchFilters({ categories }: SearchFiltersProps) {
  const categoryId = useSearchFiltersStore((state) => state.categoryId);
  const maxPrice = useSearchFiltersStore((state) => state.maxPrice);
  const minPrice = useSearchFiltersStore((state) => state.minPrice);
  const minRating = useSearchFiltersStore((state) => state.minRating);
  const setCategoryId = useSearchFiltersStore((state) => state.setCategoryId);
  const setMaxPrice = useSearchFiltersStore((state) => state.setMaxPrice);
  const setMinPrice = useSearchFiltersStore((state) => state.setMinPrice);
  const setMinRating = useSearchFiltersStore((state) => state.setMinRating);

  return (
    <View className="gap-4 rounded-[28px] bg-brand-card p-5">
      <View className="gap-2">
        <UIText className="text-base font-semibold">Category</UIText>
        <FlatList
          data={[
            {
              id: 0,
              name: "All categories"
            },
            ...categories
          ]}
          horizontal
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => {
            const isSelected =
              item.id === 0 ? categoryId === null : item.id === categoryId;

            return (
              <Pressable
                className={`mr-3 rounded-full px-4 py-3 ${
                  isSelected
                    ? "bg-brand-clay"
                    : "border border-brand-border bg-white"
                }`}
                onPress={() => setCategoryId(item.id === 0 ? null : item.id)}
              >
                <UIText
                  className={`text-sm font-semibold ${
                    isSelected ? "text-white" : "text-brand-ink"
                  }`}
                >
                  {item.name}
                </UIText>
              </Pressable>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View className="gap-2">
        <UIText className="text-base font-semibold">Price range</UIText>
        <View className="flex-row gap-3">
          <View className="flex-1 gap-1">
            <MutedText className="text-xs uppercase tracking-[1.5px]">
              Minimum
            </MutedText>
            <Input
              keyboardType="numeric"
              onChangeText={(value) => setMinPrice(Number(value) || 0)}
              placeholder="0"
              value={String(minPrice)}
            />
          </View>
          <View className="flex-1 gap-1">
            <MutedText className="text-xs uppercase tracking-[1.5px]">
              Maximum
            </MutedText>
            <Input
              keyboardType="numeric"
              onChangeText={(value) =>
                setMaxPrice(value.trim() ? Number(value) : null)
              }
              placeholder="No maximum"
              value={maxPrice === null ? "" : String(maxPrice)}
            />
          </View>
        </View>
      </View>

      <View className="gap-2">
        <UIText className="text-base font-semibold">Minimum rating</UIText>
        <FlatList
          data={ratingOptions}
          horizontal
          keyExtractor={(item) => String(item)}
          renderItem={({ item }) => {
            const isSelected = item === minRating;

            return (
              <Pressable
                className={`mr-3 rounded-full px-4 py-3 ${
                  isSelected
                    ? "bg-brand-mint"
                    : "border border-brand-border bg-white"
                }`}
                onPress={() => setMinRating(item)}
              >
                <UIText
                  className={`text-sm font-semibold ${
                    isSelected ? "text-white" : "text-brand-ink"
                  }`}
                >
                  {item === 0 ? "Any" : `${item}+`}
                </UIText>
              </Pressable>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
