import React from 'react';

import { UIText } from '@/components/ui/text';
import { getCategoryImage } from '@/features/services/lib/category-visuals';
import type { ServiceCategory } from '@/features/services/types';
import { Pressable, View } from '@/tw';
import { Image } from '@/tw/image';

type SearchCategoryListProps = {
  categories: ServiceCategory[];
  onSelectCategory: (category: ServiceCategory) => void;
};

export const SearchCategoryList = React.memo(function SearchCategoryList({
  categories,
  onSelectCategory,
}: SearchCategoryListProps) {
  return (
    <View className="flex-row flex-wrap">
      {categories.map((category) => (
        <View key={category.id} className="w-1/2 pb-5 pr-3">
          <Pressable
            className="flex-row items-center gap-4"
            onPress={() => onSelectCategory(category)}
          >
            <Image
              className="h-24 w-24 rounded-2xl bg-brand-sand-strong"
              contentFit="cover"
              source={getCategoryImage(category.slug)}
            />
            <UIText className="flex-1 text-xl font-semibold leading-7">{category.name}</UIText>
          </Pressable>
        </View>
      ))}
    </View>
  );
});
