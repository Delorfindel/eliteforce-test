import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Input } from '@/components/ui/input';
import { Heading, UIText } from '@/components/ui/text';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { listCategories } from '@/features/services/api/list-categories';
import { HomeCategoryGrid } from '@/features/services/components/home-category-grid';
import { getAddressHeadline } from '@/features/services/lib/address';
import { Pressable, ScrollView, View } from '@/tw';

export default function HomeRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useAuthSession();
  const categoriesQuery = useQuery({
    queryFn: listCategories,
    queryKey: ['service-categories'],
  });

  const categories = categoriesQuery.data ?? [];
  const popularCategories = categories.slice(0, 6);
  const trendingCategories = categories.slice(1);

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="pb-12">
      <View
        className="border-b border-brand-border bg-white px-5 pb-6"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="flex-row items-center justify-between gap-4">
          <Pressable
            className="flex-row items-center gap-3"
            onPress={() =>
              router.push({
                pathname: '/search/address',
                params: { next: 'home' },
              })
            }
          >
            <MaterialCommunityIcons color="#0E7051" name="map-marker-outline" size={28} />
            <UIText className="text-[20px]">{getAddressHeadline(profile?.default_address)}</UIText>
          </Pressable>
          <MaterialCommunityIcons
            color="#0E7051"
            name="magnify"
            onPress={() => router.push('/search')}
            size={34}
          />
        </View>
      </View>

      <View className="px-5 pt-8">
        <Heading className="text-[24px] leading-[32px]">Je recherche un prestataire en...</Heading>

        <Input
          className="mt-6 bg-white text-lg"
          editable={false}
          onPressIn={() => router.push('/search')}
          placeholder='Recherchez "Fixation TV", "Plomberie"...'
        />
      </View>

      <View className="mt-8 px-5">
        <UIText className="mb-4 text-[20px] font-semibold">Projets populaires</UIText>
        <HomeCategoryGrid
          categories={popularCategories}
          onSelectCategory={(category) =>
            router.push({
              pathname: '/search/confirm',
              params: { categoryId: String(category.id) },
            })
          }
        />
      </View>

      <View className="mt-2 px-5">
        <UIText className="mb-4 text-[20px] font-semibold">Projets tendance</UIText>
        <HomeCategoryGrid
          categories={trendingCategories}
          onSelectCategory={(category) =>
            router.push({
              pathname: '/search/confirm',
              params: { categoryId: String(category.id) },
            })
          }
        />
      </View>
    </ScrollView>
  );
}
