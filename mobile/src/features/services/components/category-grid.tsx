import React from "react";
import { FlatList } from "react-native";
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
    <FlatList
      columnWrapperStyle={{
        gap: 12
      }}
      contentContainerStyle={{
        gap: 12
      }}
      data={categories}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      renderItem={({ item }) => (
        <Pressable
          className="flex-1 rounded-[24px] border border-brand-border bg-brand-card p-4"
          onPress={() => onSelectCategory?.(item)}
        >
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-brand-sand-strong">
            <MaterialCommunityIcons
              color="#b2502d"
              name={(item.icon_key || "tools") as keyof typeof MaterialCommunityIcons.glyphMap}
              size={24}
            />
          </View>
          <UIText className="mt-4 text-base font-semibold text-brand-ink">
            {item.name}
          </UIText>
          <MutedText className="mt-1 text-sm">
            Voir les prestations actives de cette categorie.
          </MutedText>
        </Pressable>
      )}
      scrollEnabled={false}
    />
  );
}
