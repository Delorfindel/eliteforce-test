import React from "react";
import { FlatList } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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
  const minRating = useSearchFiltersStore((state) => state.minRating);
  const setCategoryId = useSearchFiltersStore((state) => state.setCategoryId);
  const setMaxPrice = useSearchFiltersStore((state) => state.setMaxPrice);
  const setMinRating = useSearchFiltersStore((state) => state.setMinRating);
  const resetFilters = useSearchFiltersStore((state) => state.resetFilters);
  const [isOpen, setIsOpen] = React.useState(false);

  const hasActiveFilters =
    categoryId !== null || maxPrice !== null || minRating !== 0;

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
                    : "bg-brand-sand-strong"
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

      <View className="rounded-2xl border border-brand-border bg-white">
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
              color="#525252"
              name={isOpen ? "chevron-up" : "chevron-down"}
              size={22}
            />
          </View>
        </Pressable>

        {isOpen ? (
          <View className="gap-4 border-t border-brand-border px-4 py-4">
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <UIText className="text-sm font-semibold text-brand-ink">
                  Prix maximum
                </UIText>
                <UIText className="text-sm font-semibold text-primary-600">
                  {maxPrice === null ? "Sans limite" : `${maxPrice} MAD`}
                </UIText>
              </View>
              <View className="py-2">
                {/* <Slider
                  defaultValue={maxPrice === null ? 1000 : maxPrice}
                  maxValue={1000}
                  minValue={50}
                  onChange={(value) => {
                    const numValue = Math.round(value / 50) * 50;
                    if (numValue >= 1000) {
                      setMaxPrice(null);
                    } else {
                      setMaxPrice(numValue);
                    }
                  }}
                  step={50}
                >
                  <SliderTrack style={{ backgroundColor: "#E5E5E5" }}>
                    <SliderFilledTrack style={{ backgroundColor: "#0E7051" }} />
                  </SliderTrack>
                  <SliderThumb style={{ backgroundColor: "#0E7051" }} />
                </Slider> */}
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
                          ? "bg-brand-clay"
                          : "bg-brand-sand-strong"
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
