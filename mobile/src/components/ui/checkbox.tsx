import { UIText } from '@/components/ui/text';
import { cn } from '@/lib/cn';
import { Pressable, View } from '@/tw';

type CheckboxProps = {
  checked: boolean;
  label: string;
  onChange: (nextValue: boolean) => void;
};

export function Checkbox({ checked, label, onChange }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      className="flex-row items-start gap-3"
      onPress={() => onChange(!checked)}
    >
      <View
        className={cn(
          'mt-0.5 h-6 w-6 items-center justify-center rounded-md border',
          checked ? 'border-brand-clay bg-brand-clay' : 'border-brand-border bg-white',
        )}
      >
        {checked ? <UIText className="text-sm text-white">✓</UIText> : null}
      </View>
      <UIText className="flex-1 text-sm leading-6 text-brand-ink-soft">{label}</UIText>
    </Pressable>
  );
}
