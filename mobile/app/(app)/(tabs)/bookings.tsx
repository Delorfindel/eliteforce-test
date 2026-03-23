import React from "react";

import { Button } from "@/components/ui/button";
import { Heading, MutedText } from "@/components/ui/text";
import { ScrollView, View } from "@/tw";

export default function BookingsRoute() {
  return (
    <ScrollView
      className="flex-1 bg-brand-sand"
      contentContainerClassName="gap-6 px-5 pb-10 pt-6"
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="gap-3">
        <Heading>Your bookings</Heading>
        <MutedText className="text-base leading-7">
          Booking history is intentionally out of scope for this first slice, but
          the navigation and empty-state shell are ready for that data next.
        </MutedText>
      </View>

      <View className="rounded-[32px] bg-brand-card p-6 shadow-[0_12px_32px_rgba(24,35,40,0.08)]">
        <Heading className="text-2xl">No bookings yet</Heading>
        <MutedText className="mt-3 text-base leading-7">
          When you book your first service, upcoming appointments and status
          updates will appear here.
        </MutedText>
        <Button className="mt-6" variant="secondary">
          Booking flows arrive in the next slice
        </Button>
      </View>
    </ScrollView>
  );
}
