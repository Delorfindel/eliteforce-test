import React from 'react';

import { FormControl } from '@/components/ui/form-control';
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
    <FormControl error={error} label={label}>
      <View className="relative">
        <Input {...props} className="pr-16" secureTextEntry={!visible} />
        <Pressable
          className="absolute inset-y-0 right-4 items-center justify-center"
          hitSlop={12}
          onPress={() => setVisible((current) => !current)}
        >
          <UIText className="text-sm font-semibold text-brand-clay">
            {visible ? 'Hide' : 'Show'}
          </UIText>
        </Pressable>
      </View>
    </FormControl>
  );
}
