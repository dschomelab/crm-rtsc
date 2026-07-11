import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { maskCpfCnpj, maskPhone, maskCep, maskCurrency } from '@/lib/masks';

type MaskType = 'cpfCnpj' | 'phone' | 'cep' | 'currency';

const maskFns: Record<MaskType, (v: string) => string> = {
  cpfCnpj: maskCpfCnpj,
  phone: maskPhone,
  cep: maskCep,
  currency: maskCurrency,
};

interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  mask: MaskType;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(({ mask, onChange, value = '', error, className, ...props }, ref) => {
  const applyMask = maskFns[mask];
  const [display, setDisplay] = React.useState(() => applyMask(value));

  React.useEffect(() => {
    setDisplay(applyMask(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyMask(e.target.value);
    setDisplay(masked);
    onChange?.(masked);
  };

  return (
    <Input
      ref={ref}
      value={display}
      onChange={handleChange}
      error={error}
      className={cn(mask === 'currency' && 'text-right', className)}
      {...props}
    />
  );
});
MaskedInput.displayName = 'MaskedInput';

export { MaskedInput, type MaskType };
