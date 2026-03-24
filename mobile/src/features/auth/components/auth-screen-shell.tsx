import { Link } from 'expo-router';
import type React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Heading, MutedText, UIText } from '@/components/ui/text';
import { ScrollView, View } from '@/tw';

type AuthScreenShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footerHref?: '/login' | '/register' | '/forgot-password';
  footerLabel?: string;
  footerText?: string;
};

export function AuthScreenShell({
  children,
  description,
  footerHref,
  footerLabel,
  footerText,
  title,
}: AuthScreenShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-brand-sand"
      contentContainerClassName="min-h-full px-5 pb-10"
      contentContainerStyle={{ paddingTop: insets.top + 24 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center gap-6">
        <View className="gap-3">
          <MutedText className="text-sm uppercase tracking-[2px] text-brand-clay">
            EliteForce Multiservices
          </MutedText>
          <Heading>{title}</Heading>
          <MutedText className="text-base leading-7">{description}</MutedText>
        </View>

        <View className="gap-5 rounded-2xl bg-brand-card p-6 shadow-sm">{children}</View>

        {footerHref && footerLabel && footerText ? (
          <UIText className="text-center text-sm text-brand-ink-soft">
            {footerText}{' '}
            <Link href={footerHref}>
              <UIText className="text-sm font-semibold text-brand-clay">{footerLabel}</UIText>
            </Link>
          </UIText>
        ) : null}
      </View>
    </ScrollView>
  );
}
