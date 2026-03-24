import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { MutedText, UIText } from '@/components/ui/text';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { listCategories } from '@/features/services/api/list-categories';
import { getSavedAddress } from '@/features/services/lib/address';
import { useSearchFiltersStore } from '@/store/search-filters-store';
import { Pressable, View } from '@/tw';

export default function SearchConfirmRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { profile } = useAuthSession();
  const setCategoryId = useSearchFiltersStore((state) => state.setCategoryId);
  const categoriesQuery = useQuery({
    queryFn: listCategories,
    queryKey: ['service-categories'],
  });

  const selectedCategory = (categoriesQuery.data ?? []).find(
    (item) => item.id === Number(categoryId),
  );
  const savedAddress = getSavedAddress(profile);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-white px-5 pb-8" style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center justify-between border-b border-brand-border pb-6">
          <View className="w-10" />
          <UIText className="text-[20px] font-semibold">
            {selectedCategory?.name ?? 'Catégorie'}
          </UIText>
          <MaterialCommunityIcons
            color="#0A0A0A"
            name="close"
            onPress={() => router.back()}
            size={36}
          />
        </View>

        <Pressable
          className="mt-8 flex-row items-start justify-between gap-4 border-b border-brand-border pb-8"
          onPress={() =>
            router.push({
              pathname: '/search/address',
              params: {
                categoryId: categoryId ?? '',
                next: 'confirm',
              },
            })
          }
        >
          <View className="flex-1">
            <MutedText className="text-[16px]">Adresse de la Task</MutedText>
            <UIText className="mt-1 text-[16px] font-semibold leading-6">
              {savedAddress?.label ?? 'Ajoutez votre adresse pour continuer'}
            </UIText>
            {savedAddress?.details ? (
              <MutedText className="mt-1 text-sm">{savedAddress.details}</MutedText>
            ) : null}
          </View>
          <MaterialCommunityIcons color="#0A0A0A" name="pencil" size={24} />
        </Pressable>

        <View className="flex-1" />

        <Button
          disabled={!selectedCategory || !savedAddress}
          onPress={() => {
            if (!selectedCategory) {
              return;
            }

            setCategoryId(selectedCategory.id);
            router.push({
              pathname: '/search/results',
              params: { categoryId: String(selectedCategory.id) },
            });
          }}
        >
          Continuer
        </Button>
      </View>
    </>
  );
}
