import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { MutedText, UIText } from '@/components/ui/text';
import type { ServiceCategory } from '@/features/services/types';
import { Pressable, View } from '@/tw';

type CategoryGridProps = {
  categories: ServiceCategory[];
  onSelectCategory?: (category: ServiceCategory) => void;
};

export function CategoryGrid({ categories, onSelectCategory }: CategoryGridProps) {
  return (
    <View className="-mx-1.5 flex-row flex-wrap gap-y-3">
      {categories.map((item, index) => {
        const isFullWidth = categories.length % 2 !== 0 && index === categories.length - 1;
        return (
          <View key={item.id} className={`${isFullWidth ? 'w-full' : 'w-1/2'} px-1.5`}>
            <Pressable
              className="rounded-2xl bg-brand-sand-strong p-4"
              onPress={() => onSelectCategory?.(item)}
            >
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-accent-light">
                  <MaterialCommunityIcons
                    color="#0E7051"
                    name={
                      (item.icon_key || 'tools') as keyof typeof MaterialCommunityIcons.glyphMap
                    }
                    size={20}
                  />
                </View>
                <UIText className="flex-1 text-base font-semibold text-brand-ink leading-5">
                  {item.name}
                </UIText>
              </View>
              <MutedText className="mt-3 text-sm leading-5">
                Voir les prestations actives de cette categorie.
              </MutedText>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}
