import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

type AuthSubmitButtonProps = {
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  label: string;
  onPress?: () => void;
};

export function AuthSubmitButton({
  className,
  disabled,
  label,
  loading,
  onPress,
}: AuthSubmitButtonProps) {
  return (
    <Button
      className={cn('mt-2', className)}
      disabled={disabled}
      loading={loading}
      onPress={onPress}
    >
      {label}
    </Button>
  );
}
