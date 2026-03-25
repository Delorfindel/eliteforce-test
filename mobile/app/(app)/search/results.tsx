import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { MutedText, UIText } from '@/components/ui/text';
import { listCategories } from '@/features/services/api/list-categories';
import { searchTaskers } from '@/features/services/api/search-taskers';
import { TaskerResultCard } from '@/features/services/components/tasker-result-card';
import { useSearchFiltersStore } from '@/store/search-filters-store';
import { Pressable, View } from '@/tw';

const ratingOptions = [0, 4, 4.5, 5];
const MIN_PRICE_FILTER = 50;
const MAX_PRICE_FILTER = 1000;
const PRICE_STEP = 10;
const sliderThumbSmall = require('./slider-thumb-small.png');

export default function SearchResultsRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const query = '';
  const availability = useSearchFiltersStore((state) => state.availability);
  const selectedCategoryId = useSearchFiltersStore((state) => state.categoryId);
  const maxPrice = useSearchFiltersStore((state) => state.maxPrice);
  const minRating = useSearchFiltersStore((state) => state.minRating);
  const sortBy = useSearchFiltersStore((state) => state.sortBy);
  const setAvailability = useSearchFiltersStore((state) => state.setAvailability);
  const setCategoryId = useSearchFiltersStore((state) => state.setCategoryId);
  const setMaxPrice = useSearchFiltersStore((state) => state.setMaxPrice);
  const setMinRating = useSearchFiltersStore((state) => state.setMinRating);
  const setSortBy = useSearchFiltersStore((state) => state.setSortBy);
  const routeCategoryId = React.useMemo(() => {
    if (!categoryId) {
      return null;
    }

    const parsedCategoryId = Number(categoryId);
    if (Number.isNaN(parsedCategoryId)) {
      return null;
    }

    return parsedCategoryId;
  }, [categoryId]);
  const effectiveCategoryId = routeCategoryId ?? selectedCategoryId;

  React.useEffect(() => {
    if (routeCategoryId === null) {
      return;
    }

    setCategoryId(routeCategoryId);
  }, [routeCategoryId, setCategoryId]);

  const categoriesQuery = useQuery({
    queryFn: listCategories,
    queryKey: ['service-categories'],
  });
  const searchQuery = useQuery({
    queryFn: () =>
      searchTaskers({
        availability,
        categoryId: effectiveCategoryId,
        maxPrice,
        minRating,
        query,
        sortBy,
      }),
    queryKey: [
      'tasker-search',
      effectiveCategoryId,
      availability,
      maxPrice,
      minRating,
      query,
      sortBy,
    ],
  });

  const selectedCategory = (categoriesQuery.data ?? []).find(
    (item) => item.id === effectiveCategoryId,
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-white">
        <View
          className="border-b border-brand-border bg-white px-5 pb-3"
          style={{ paddingTop: insets.top + 8 }}
        >
          <View className="flex-row items-center justify-between">
            <MaterialCommunityIcons
              color="#0A0A0A"
              name="chevron-left"
              onPress={() => router.back()}
              size={36}
            />
            <UIText className="text-[20px] font-semibold">Sélectionner un profil</UIText>
            <MaterialCommunityIcons
              color="#0E7051"
              name="tune-vertical"
              onPress={() => setFiltersOpen((current) => !current)}
              size={30}
            />
          </View>

          <View className="mt-2 flex-row items-center gap-2">
            <Pressable
              className={`rounded-full px-4 py-2.5 ${availability === 'within_7_days' ? 'bg-brand-clay' : 'border border-brand-clay bg-white'}`}
              onPress={() =>
                setAvailability(availability === 'within_7_days' ? 'all' : 'within_7_days')
              }
            >
              <UIText
                className={`text-sm font-semibold ${availability === 'within_7_days' ? 'text-white' : 'text-brand-clay'}`}
              >
                D'ici 7 jours
              </UIText>
            </Pressable>
            <Pressable
              className={`rounded-full px-4 py-2.5 ${sortBy === 'recommended' ? 'border border-brand-clay bg-white' : 'bg-brand-clay'}`}
              onPress={() =>
                setSortBy(
                  sortBy === 'recommended'
                    ? 'price_asc'
                    : sortBy === 'price_asc'
                      ? 'price_desc'
                      : 'recommended',
                )
              }
            >
              <View className="flex-row items-center gap-1.5">
                <UIText
                  className={`text-sm font-semibold ${sortBy === 'recommended' ? 'text-brand-clay' : 'text-white'}`}
                >
                  Tarif
                </UIText>
                {sortBy !== 'recommended' ? (
                  <MaterialCommunityIcons
                    color={sortBy === 'recommended' ? '#0E7051' : '#FFFFFF'}
                    name={sortBy === 'price_asc' ? 'chevron-up' : 'chevron-down'}
                    size={18}
                  />
                ) : null}
              </View>
            </Pressable>
          </View>

          {filtersOpen ? (
            <View className="mt-2 gap-3 rounded-2xl bg-brand-sand p-3">
              <View className="gap-1.5">
                <UIText className="text-sm font-semibold">Note</UIText>
                <View className="flex-row flex-wrap gap-1.5">
                  {ratingOptions.map((item) => {
                    const selected = item === minRating;
                    return (
                      <Pressable
                        key={item}
                        className={`rounded-full px-3.5 py-1.5 ${selected ? 'bg-brand-clay' : 'bg-white'}`}
                        onPress={() => setMinRating(item)}
                      >
                        <UIText
                          className={`text-xs font-semibold ${selected ? 'text-white' : 'text-brand-ink'}`}
                        >
                          {item === 0 ? 'Toutes' : `${item}+`}
                        </UIText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="gap-1.5">
                <UIText className="text-sm font-semibold">Prix</UIText>
                <View className="flex-row items-center gap-2.5">
                  <View className="flex-1">
                    <Slider
                      maximumTrackTintColor="#D4D4D4"
                      maximumValue={MAX_PRICE_FILTER}
                      minimumTrackTintColor="#0E7051"
                      minimumValue={MIN_PRICE_FILTER}
                      onSlidingComplete={(value) => {
                        const roundedValue = Math.round(value / PRICE_STEP) * PRICE_STEP;
                        if (roundedValue >= MAX_PRICE_FILTER) {
                          setMaxPrice(null);
                          return;
                        }

                        setMaxPrice(roundedValue);
                      }}
                      style={{ height: 20 }}
                      step={PRICE_STEP}
                      thumbImage={sliderThumbSmall}
                      value={maxPrice === null ? MAX_PRICE_FILTER : maxPrice}
                    />
                  </View>
                  <View className="h-8 min-w-[88px] flex-row items-center justify-end">
                    <UIText className="text-sm font-semibold leading-[18px] text-brand-ink-soft">
                      {maxPrice === null ? `${MAX_PRICE_FILTER}+` : maxPrice}
                    </UIText>
                    <UIText className="ml-1 text-sm font-semibold leading-[18px] text-brand-ink-soft">
                      MAD
                    </UIText>
                  </View>
                </View>
              </View>
            </View>
          ) : null}
        </View>

        <FlatList
          contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20, paddingTop: 20 }}
          data={searchQuery.data ?? []}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={
            searchQuery.isLoading ? (
              <View className="items-center py-20">
                <Spinner size="large" />
              </View>
            ) : (
              <View className="items-center gap-3 py-20">
                <UIText className="text-lg font-semibold">Aucun profil disponible</UIText>
                <MutedText className="text-center text-sm leading-5">
                  Ajustez vos filtres pour {selectedCategory?.name ?? 'cette catégorie'}.
                </MutedText>
                <Button onPress={() => router.back()} variant="ghost">
                  Modifier la recherche
                </Button>
              </View>
            )
          }
          ItemSeparatorComponent={() => <View className="h-6" />}
          renderItem={({ index, item }) => (
            <View>
              <TaskerResultCard onPress={() => router.push(`/taskers/${item.id}`)} result={item} />
              {index === 1 ? (
                <View className="mt-6 rounded-[28px] border border-brand-border p-5">
                  <View className="flex-row items-start gap-4">
                    <MaterialCommunityIcons color="#0E7051" name="shield-check-outline" size={28} />
                    <UIText className="flex-1 text-base leading-6">
                      L'identité de chaque Tasker est vérifiée. Chaque mission inclut notre promesse
                      de satisfaction.
                    </UIText>
                  </View>
                </View>
              ) : null}
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}
