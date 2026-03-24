import type React from 'react';
import { Input } from '@/components/ui/input';
import { UIText } from '@/components/ui/text';
import { cn } from '@/lib/cn';
import { View } from '@/tw';

type AuthTextFieldProps = React.ComponentProps<typeof Input> & {
  error?: string;
  helperText?: string;
  label: string;
};

export function AuthTextField({ error, helperText, label, ...props }: AuthTextFieldProps) {
  return (
    <View className="mb-2">
      <Input
        {...props}
        placeholderTextColor="#A3A3A3"
        placeholder={label}
        className={cn(
          'min-h-14 rounded-none border-0 border-b border-brand-border bg-transparent px-0 text-base',
          props.className,
        )}
      />
      {error && <UIText className="mt-1 text-sm text-brand-danger">{error}</UIText>}
    </View>
  );
}
