import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { MutedText, UIText } from "@/components/ui/text";
import { Pressable, View } from "@/tw";
import type { ServiceCategory } from "@/features/services/types";

type CategoryGridProps = {
  categories: ServiceCategory[];
  onSelectCategory?: (category: ServiceCategory) => void;
};

export function CategoryGrid({
  categories,
  onSelectCategory
}: CategoryGridProps) {
  return (
    <View className="flex-row flex-wrap justify-between gap-y-3">
      {categories.map((item, index) => {
        const isFullWidth = categories.length % 2 !== 0 && index === categories.length - 1;
        return (
          <Pressable
            key={item.id}
            className={`rounded-2xl bg-brand-sand-strong p-4 ${
              isFullWidth ? "w-full" : "w-[48%]"
            }`}
            onPress={() => onSelectCategory?.(item)}
          >
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-accent-light">
                <MaterialCommunityIcons
                  color="#0E7051"
                  name={(item.icon_key || "tools") as keyof typeof MaterialCommunityIcons.glyphMap}
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
        );
      })}
    </View>
  );
}
