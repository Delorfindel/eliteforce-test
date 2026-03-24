import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { MutedText, UIText } from "@/components/ui/text";
import { ScrollView, View } from "@/tw";

export default function BookingsRoute() {
  return (
    <ScrollView
      className="flex-1 bg-brand-sand"
      contentContainerClassName="flex-1 items-center justify-center px-5 pb-10"
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="items-center gap-4">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-sand-strong">
          <MaterialCommunityIcons color="#A3A3A3" name="calendar-clock-outline" size={28} />
        </View>
        <UIText className="text-lg font-semibold">Aucune réservation</UIText>
        <MutedText className="text-center text-sm leading-5">
          Vos rendez-vous et confirmations{"\n"}apparaîtront ici.
        </MutedText>
      </View>
    </ScrollView>
  );
}
