import { Link, Stack } from "expo-router";
import React from "react";

import { Button } from "@/components/ui/button";
import { Heading, MutedText } from "@/components/ui/text";
import { View } from "@/tw";

export default function NotFoundRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Not found" }} />
      <View className="flex-1 items-center justify-center bg-brand-sand px-8">
        <View className="w-full max-w-sm gap-6 rounded-2xl bg-brand-card p-8">
          <Heading className="text-center text-2xl">This route does not exist</Heading>
          <MutedText className="text-center">
            The screen may have moved, or the link is no longer valid.
          </MutedText>
          <Link asChild href="/">
            <Button>Return home</Button>
          </Link>
        </View>
      </View>
    </>
  );
}
