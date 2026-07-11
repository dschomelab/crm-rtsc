import { useState } from 'react';
import { Building2, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function CompaniesPage() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', phone: '', email: '', document: '', website: '' });

  const { data, isLoading } = useQuery({ queryKey: ['companies'], queryFn: () => apiClient.get('/companies') });
  const createMutation = useMutation({
    mutationFn: (d: any) => apiClient.post('/companies', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['companies'] }); setDialogOpen(false); },
  });

  const companies: any[] = (data as any) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3"><Building2 className="h-6 w-6 text-primary" /><h1 className="text-2xl font-bold tracking-tight">Empresas</h1></div>
        <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Nova Empresa</Button>
      </div>
      {isLoading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div> : companies.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-muted-foreground"><Building2 className="mb-2 h-12 w-12" /><p className="text-sm">Nenhuma empresa cadastrada</p></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c: any) => (
            <div key={c.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between"><h3 className="font-medium">{c.name}</h3><Badge className={c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>{c.isActive ? 'Ativa' : 'Inativa'}</Badge></div>
              <p className="mt-1 text-xs text-muted-foreground">Slug: {c.slug}</p>
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">{c.email && <p>{c.email}</p>}{c.phone && <p>{c.phone}</p>}{c.document && <p>CNPJ: {c.document}</p>}</div>
            </div>
          ))}
        </div>
      )}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDialogOpen(false)} />
          <div className="relative z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Nova Empresa</h2>
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div className="space-y-1"><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div className="space-y-1"><Label>Telefone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>CNPJ</Label><Input value={form.document} onChange={(e) => setForm({ ...form, document: e.target.value })} /></div>
                <div className="space-y-1"><Label>Website</Label><Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></div>
              </div>
              <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button><Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Criar</Button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
