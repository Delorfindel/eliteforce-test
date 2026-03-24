import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useQuery } from '@tanstack/react-query';
import { Redirect, useRouter } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Input } from '@/components/ui/input';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { listCategories } from '@/features/services/api/list-categories';
import { SearchCategoryList } from '@/features/services/components/search-category-list';
import { ScrollView, View } from '@/tw';

export default function SearchRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useAuthSession();
  const [query, setQuery] = React.useState('');
  const isProvider = profile?.role === 'provider';

  const categoriesQuery = useQuery({
    enabled: !isProvider,
    queryFn: listCategories,
    queryKey: ['service-categories'],
  });

  if (isProvider) {
    return <Redirect href="/bookings" />;
  }

  const normalizedQuery = query.trim().toLowerCase();
  const categories = (categoriesQuery.data ?? []).filter((category) =>
    !normalizedQuery
      ? true
      : `${category.name} ${category.slug}`.toLowerCase().includes(normalizedQuery),
  );

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="px-5 pb-12">
      <View className="flex-row items-center gap-3 pt-3" style={{ paddingTop: insets.top + 8 }}>
        <MaterialCommunityIcons
          color="#0A0A0A"
          name="chevron-left"
          onPress={() => router.back()}
          size={36}
        />
        <View className="flex-1">
          <Input
            autoFocus
            className="h-16 rounded-[28px] border-brand-border text-[18px]"
            onChangeText={setQuery}
            placeholder="De quoi avez-vous besoin ?"
            value={query}
          />
        </View>
      </View>

      <View className="pt-8">
        <SearchCategoryList
          categories={categories}
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
