import { useState, useEffect, useRef } from 'react';
import { fetchAddressByCep } from '@/services/cep';

interface AddressFields {
  address: string;
  city: string;
  state: string;
}

export function useCepLookup(zipCode: string) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AddressFields | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const digits = zipCode.replace(/\D/g, '');
    if (digits.length !== 8) {
      setResult(null);
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      const data = await fetchAddressByCep(zipCode);
      if (data) {
        const fields: AddressFields = {
          address: data.logradouro,
          city: data.localidade,
          state: data.uf,
        };
        setResult(fields);
      } else {
        setResult(null);
      }
      setLoading(false);
    }, 600);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [zipCode]);

  return { loadingCep: loading, cepResult: result };
}
