import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormErrorProps {
  message?: string;
  className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;
  return (
    <p className={cn('mt-1 text-xs text-destructive', className)} role="alert">
      {message}
    </p>
  );
}

interface FormAlertProps {
  messages: string[];
  className?: string;
}

export function FormAlert({ messages, className }: FormAlertProps) {
  if (!messages || messages.length === 0) return null;
  return (
    <div className={cn('flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive', className)} role="alert">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        {messages.length === 1 ? (
          <p>{messages[0]}</p>
        ) : (
          <ul className="list-inside list-disc space-y-0.5">
            {messages.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
