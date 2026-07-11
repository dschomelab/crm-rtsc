import { useState, useEffect } from 'react';
import { Settings, Loader2, Save, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MaskedInput } from '@/components/ui/masked-input';
import { BackButton } from '@/components/shared/back-button';
import { useCepLookup } from '@/hooks/useCepLookup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';

export function AdminSettingsPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: '', logoUrl: '', phone: '', email: '', website: '', document: '',
    address: '', number: '', complement: '', city: '', state: '', zipCode: '',
  });
  const { loadingCep, cepResult } = useCepLookup(form.zipCode);

  useEffect(() => {
    if (cepResult) {
      setForm((prev) => ({
        ...prev,
        address: cepResult.address || prev.address,
        city: cepResult.city || prev.city,
        state: cepResult.state || prev.state,
      }));
    }
  }, [cepResult]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => apiClient.get('/admin/settings'),
  });

  useEffect(() => {
    const d = (data as any)?.data ?? data;
    if (d) {
      setForm({
        name: d.name ?? '',
        logoUrl: d.logoUrl ?? '',
        address: d.address ?? '',
        number: d.number ?? '',
        complement: d.complement ?? '',
        city: d.city ?? '',
        state: d.state ?? '',
        zipCode: d.zipCode ?? '',
        phone: d.phone ?? '',
        email: d.email ?? '',
        website: d.website ?? '',
        document: d.document ?? '',
      });
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (d: any) => apiClient.put('/admin/settings', d),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'settings'] }),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveMutation.mutate(form);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2"><BackButton /><Settings className="h-6 w-6 text-primary" /><h1 className="text-2xl font-bold tracking-tight">Configurações</h1></div>
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1 col-span-2">
                <Label>Nome da Empresa</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <Label>Telefone</Label>
                <MaskedInput mask="phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              </div>
              <div className="space-y-1">
                <Label>E-mail</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Website</Label>
                <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Documento</Label>
                <Input value={form.document} onChange={(e) => setForm({ ...form, document: e.target.value })} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>Logo URL</Label>
                <Input value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Endereço</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>CEP</Label>
                <div className="relative">
                  <MaskedInput mask="cep" value={form.zipCode} onChange={(v) => setForm({ ...form, zipCode: v })} />
                  {loadingCep && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
                  {!loadingCep && form.zipCode.replace(/\D/g, '').length === 8 && form.address && (
                    <MapPin className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                  )}
                </div>
              </div>
              <div className="space-y-1 col-span-2">
                <Label>Logradouro</Label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Número</Label>
                <Input value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Complemento</Label>
                <Input value={form.complement} onChange={(e) => setForm({ ...form, complement: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Cidade</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Estado</Label>
                <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" /> Salvar
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
