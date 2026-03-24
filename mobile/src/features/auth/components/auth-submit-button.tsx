import { Button } from '@/components/ui/button';

type AuthSubmitButtonProps = {
  disabled?: boolean;
  loading?: boolean;
  label: string;
  onPress?: () => void;
};

export function AuthSubmitButton({ disabled, label, loading, onPress }: AuthSubmitButtonProps) {
  return (
    <Button className="mt-2" disabled={disabled} loading={loading} onPress={onPress}>
      {label}
    </Button>
  );
}
