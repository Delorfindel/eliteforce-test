import type React from 'react';

import { FormControl } from '@/components/ui/form-control';
import { Input } from '@/components/ui/input';

type AuthTextFieldProps = React.ComponentProps<typeof Input> & {
  error?: string;
  helperText?: string;
  label: string;
};

export function AuthTextField({ error, helperText, label, ...props }: AuthTextFieldProps) {
  return (
    <FormControl error={error} helperText={helperText} label={label}>
      <Input {...props} />
    </FormControl>
  );
}
