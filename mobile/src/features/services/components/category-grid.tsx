import React from "react";
import { FlatList } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { MutedText, UIText } from "@/components/ui/text";
import { View } from "@/tw";
import type { ServiceCategory } from "@/features/services/types";

type CategoryGridProps = {
  categories: ServiceCategory[];
};

const iconMap: Record<string, string> = {
  demenagement: "truck-delivery-outline",
  electricite: "lightning-bolt-outline",
  jardinage: "leaf-circle-outline",
  menage: "broom",
  peinture: "format-paint",
  plomberie: "pipe-wrench"
};

export function CategoryGrid({ categories }: CategoryGridProps) {
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
      pointerEvents="none"
      renderItem={({ item }) => (
        <View className="flex-1 rounded-[24px] border border-brand-border bg-brand-card p-4">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-brand-sand-strong">
            <MaterialCommunityIcons
              color="#b2502d"
              name={(iconMap[item.slug] ?? "tools") as keyof typeof MaterialCommunityIcons.glyphMap}
              size={24}
            />
          </View>
          <UIText className="mt-4 text-base font-semibold text-brand-ink">
            {item.name}
          </UIText>
          <MutedText className="mt-1 text-sm">
            Skilled help for {item.name.toLowerCase()}.
          </MutedText>
        </View>
      )}
      scrollEnabled={false}
    />
  );
}
