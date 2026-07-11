import { useState } from 'react';
import { Megaphone, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const statusColors: Record<string, string> = { DRAFT: 'bg-gray-100 text-gray-600', ACTIVE: 'bg-green-100 text-green-700', PAUSED: 'bg-yellow-100 text-yellow-700', COMPLETED: 'bg-blue-100 text-blue-700', CANCELLED: 'bg-red-100 text-red-700' };

export function CampaignsPage() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', type: '', platform: '', budget: 0, utmCampaign: '', startDate: '', endDate: '' });

  const { data, isLoading } = useQuery({ queryKey: ['campaigns'], queryFn: () => apiClient.get('/campaigns') });
  const createMutation = useMutation({
    mutationFn: (d: any) => apiClient.post('/campaigns', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['campaigns'] }); setDialogOpen(false); },
  });

  const campaigns: any[] = (data as any)?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3"><Megaphone className="h-6 w-6 text-primary" /><h1 className="text-2xl font-bold tracking-tight">Campanhas</h1></div>
        <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Nova Campanha</Button>
      </div>
      {isLoading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div> : campaigns.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-muted-foreground"><Megaphone className="mb-2 h-12 w-12" /><p className="text-sm">Nenhuma campanha encontrada</p></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c: any) => (
            <div key={c.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between"><h3 className="font-medium">{c.name}</h3><Badge className={statusColors[c.status] ?? ''}>{c.status}</Badge></div>
              {c.description && <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>}
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {c.type && <span>Tipo: {c.type}</span>}{c.platform && <span>Plataforma: {c.platform}</span>}{c.budget > 0 && <span>Orçamento: R$ {Number(c.budget).toFixed(2)}</span>}
              </div>
              {c.startDate && <p className="mt-2 text-xs text-muted-foreground">{new Date(c.startDate).toLocaleDateString('pt-BR')} → {c.endDate ? new Date(c.endDate).toLocaleDateString('pt-BR') : '...'}</p>}
            </div>
          ))}
        </div>
      )}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDialogOpen(false)} />
          <div className="relative z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Nova Campanha</h2>
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-3">
              <div className="space-y-1"><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="space-y-1"><Label>Descrição</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Tipo</Label><Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} /></div>
                <div className="space-y-1"><Label>Plataforma</Label><Input value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Orçamento (R$)</Label><Input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} /></div>
                <div className="space-y-1"><Label>UTM Campanha</Label><Input value={form.utmCampaign} onChange={(e) => setForm({ ...form, utmCampaign: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Início</Label><Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
                <div className="space-y-1"><Label>Término</Label><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
              </div>
              <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button><Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Criar</Button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
