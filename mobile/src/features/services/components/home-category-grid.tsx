import React from 'react';

import { UIText } from '@/components/ui/text';
import { getCategoryImage } from '@/features/services/lib/category-visuals';
import type { ServiceCategory } from '@/features/services/types';
import { Pressable, View } from '@/tw';
import { Image } from '@/tw/image';

type HomeCategoryGridProps = {
  categories: ServiceCategory[];
  onSelectCategory: (category: ServiceCategory) => void;
};

export const HomeCategoryGrid = React.memo(function HomeCategoryGrid({
  categories,
  onSelectCategory,
}: HomeCategoryGridProps) {
  return (
    <View className="-mx-1.5 flex-row flex-wrap">
      {categories.map((category) => (
        <View key={category.id} className="w-1/3 px-1.5 pb-6">
          <Pressable className="gap-3" onPress={() => onSelectCategory(category)}>
            <Image
              className="h-28 w-full rounded-2xl bg-brand-sand-strong"
              contentFit="cover"
              source={getCategoryImage(category.slug)}
            />
            <View className="px-1">
              <UIText className="text-[15px] font-semibold leading-5" numberOfLines={2}>
                {category.name}
              </UIText>
            </View>
          </Pressable>
        </View>
      ))}
    </View>
  );
});
