import React from "react";
import { FlatList } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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
  const resetFilters = useSearchFiltersStore((state) => state.resetFilters);
  const [isOpen, setIsOpen] = React.useState(false);

  const hasActiveFilters =
    categoryId !== null || maxPrice !== null || minPrice !== 0 || minRating !== 0;

  return (
    <View className="gap-3">
      <View className="gap-2">
        <UIText className="text-sm font-semibold text-brand-ink-soft">
          Catégories
        </UIText>
        <FlatList
          data={[
            {
              id: 0,
              name: "Toutes"
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
                className={`mr-3 rounded-full px-4 py-2.5 ${
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

      <View className="rounded-[24px] border border-brand-border bg-brand-card">
        <Pressable
          accessibilityRole="button"
          className="flex-row items-center justify-between px-4 py-4"
          onPress={() => setIsOpen((current) => !current)}
        >
          <View className="gap-0.5">
            <UIText className="text-sm font-semibold text-brand-ink">
              Filtres
            </UIText>
            <MutedText className="text-xs">
              Prix, note minimale et budget visible ici
            </MutedText>
          </View>
          <View className="flex-row items-center gap-3">
            {hasActiveFilters ? (
              <Pressable
                className="rounded-full bg-brand-sand-strong px-3 py-1.5"
                onPress={resetFilters}
              >
                <UIText className="text-xs font-semibold text-brand-ink">
                  Réinitialiser
                </UIText>
              </Pressable>
            ) : null}
            <MaterialCommunityIcons
              color="#182328"
              name={isOpen ? "chevron-up" : "chevron-down"}
              size={22}
            />
          </View>
        </Pressable>

        {isOpen ? (
          <View className="gap-4 border-t border-brand-border px-4 py-4">
            <View className="gap-2">
              <UIText className="text-sm font-semibold text-brand-ink">
                Prix
              </UIText>
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
                    placeholder="Sans limite"
                    value={maxPrice === null ? "" : String(maxPrice)}
                  />
                </View>
              </View>
            </View>

            <View className="gap-2">
              <UIText className="text-sm font-semibold text-brand-ink">
                Note minimale
              </UIText>
              <FlatList
                data={ratingOptions}
                horizontal
                keyExtractor={(item) => String(item)}
                renderItem={({ item }) => {
                  const isSelected = item === minRating;

                  return (
                    <Pressable
                      className={`mr-3 rounded-full px-4 py-2.5 ${
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
                        {item === 0 ? "Toutes" : `${item}+`}
                      </UIText>
                    </Pressable>
                  );
                }}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}
