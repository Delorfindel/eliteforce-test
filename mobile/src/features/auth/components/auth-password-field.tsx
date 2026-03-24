import React from 'react';

import { Input } from '@/components/ui/input';
import { UIText } from '@/components/ui/text';
import { Pressable, View } from '@/tw';

type AuthPasswordFieldProps = Omit<React.ComponentProps<typeof Input>, 'secureTextEntry'> & {
  error?: string;
  label: string;
};

export function AuthPasswordField({ error, label, ...props }: AuthPasswordFieldProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <View className="mb-2">
      <View className="relative">
        <Input
          {...props}
          placeholderTextColor="#A3A3A3"
          placeholder={label}
          className="min-h-14 rounded-none border-0 border-b border-brand-border bg-transparent px-0 pr-16 text-base"
          secureTextEntry={!visible}
        />
        <Pressable
          className="absolute inset-y-0 right-2 items-center justify-center"
          hitSlop={12}
          onPress={() => setVisible((current) => !current)}
        >
          <UIText className="text-sm font-semibold text-brand-ink">
            {/* The TR app uses a lock icon or nothing sometimes, but "Afficher"/"Masquer" is good or just keep it simple. */}
            {visible ? 'Masquer' : 'Afficher'}
          </UIText>
        </Pressable>
      </View>
      {error && <UIText className="mt-1 text-sm text-brand-danger">{error}</UIText>}
    </View>
  );
}
