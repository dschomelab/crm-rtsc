import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  to?: string;
  label?: string;
}

export function BackButton({ label = 'Voltar' }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => window.history.back()}
      className="gap-1 text-muted-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}
