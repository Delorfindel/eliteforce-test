import { useMutation } from "@tanstack/react-query";
import React from "react";

import { Button } from "@/components/ui/button";
import { Heading, MutedText, UIText } from "@/components/ui/text";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { ProviderServicesManager } from "@/features/services/components/provider-services-manager";
import { supabase } from "@/lib/supabase";
import { ScrollView, View } from "@/tw";

type ProfileScreenContentProps = {
  onSignedOut: () => void;
};

export function ProfileScreenContent({
  onSignedOut
}: ProfileScreenContentProps) {
  const { profile, user } = useAuthSession();
  const isProvider = profile?.role === "provider";

  const signOutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }
    },
    onSuccess: onSignedOut
  });

  return (
    <ScrollView
      className="flex-1 bg-brand-sand"
      contentContainerClassName="gap-6 px-5 pb-10 pt-6"
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="gap-3">
        <Heading>Profile</Heading>
        <MutedText className="text-base leading-7">
          Review the account details provisioned from the authenticated profile
          record and sign out safely when needed.
        </MutedText>
      </View>

      <View className="gap-4 rounded-[32px] bg-brand-card p-6 shadow-[0_12px_32px_rgba(24,35,40,0.08)]">
        <View className="gap-1">
          <MutedText className="text-xs uppercase tracking-[1.5px]">Name</MutedText>
          <UIText className="text-lg font-semibold">
            {profile ? `${profile.first_name} ${profile.last_name}` : "Loading"}
          </UIText>
        </View>

        <View className="gap-1">
          <MutedText className="text-xs uppercase tracking-[1.5px]">Email</MutedText>
          <UIText>{profile?.email ?? user?.email ?? "Unavailable"}</UIText>
        </View>

        <View className="gap-1">
          <MutedText className="text-xs uppercase tracking-[1.5px]">Phone</MutedText>
          <UIText>{profile?.phone ?? "Unavailable"}</UIText>
        </View>

        <View className="gap-1">
          <MutedText className="text-xs uppercase tracking-[1.5px]">Role</MutedText>
          <UIText>{profile?.role ?? "client"}</UIText>
        </View>
      </View>

      {isProvider && profile ? (
        <ProviderServicesManager providerId={profile.id} />
      ) : null}

      <Button
        loading={signOutMutation.isPending}
        onPress={() => signOutMutation.mutate()}
        variant="danger"
      >
        Sign out
      </Button>
    </ScrollView>
  );
}
