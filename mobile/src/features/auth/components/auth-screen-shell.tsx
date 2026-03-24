import { Link } from 'expo-router';
import type React from 'react';

import { UIText } from '@/components/ui/text';
import { Pressable, ScrollView, View } from '@/tw';

type AuthScreenShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  footerHref?: '/login' | '/register' | '/forgot-password';
  footerLabel?: string;
  footerText?: string;
  type?: 'login' | 'register';
};

export function AuthScreenShell({
  children,
  description,
  footerHref,
  footerLabel,
  footerText,
  title,
  type = 'login',
}: AuthScreenShellProps) {
  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerClassName="min-h-full px-5 pb-10 pt-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 gap-10">
          {/* Logo Section */}
          <View className="items-center gap-3">
            <UIText className="text-4xl font-bold tracking-tight text-brand-clay">
              EliteForce
            </UIText>
            {description ? (
              <UIText className="text-base text-brand-ink-soft">{description}</UIText>
            ) : null}
          </View>

          {/* Form Content */}
          <View className="gap-5">{children}</View>

          <View className="mt-auto pt-10">
            {footerHref && footerLabel && footerText ? (
              <UIText className="text-center text-base font-semibold text-brand-ink">
                {footerText}{' '}
                <Link href={footerHref}>
                  <UIText className="text-base font-semibold text-brand-clay">{footerLabel}</UIText>
                </Link>
              </UIText>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
