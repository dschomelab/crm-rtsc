import { useState } from 'react';
import { Wrench, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, THead, TBody, Tr, Th, Td } from '@/components/ui/table';
import { apiClient } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const statusColors: Record<string, string> = { PENDING: 'bg-yellow-100 text-yellow-700', IN_PROGRESS: 'bg-blue-100 text-blue-700', COMPLETED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700' };
const priorityColors: Record<string, string> = { LOW: 'bg-gray-100 text-gray-600', NORMAL: 'bg-blue-100 text-blue-700', HIGH: 'bg-orange-100 text-orange-700', URGENT: 'bg-red-100 text-red-700' };

export function ServiceOrdersPage() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', customerId: '', priority: 'NORMAL', scheduledDate: '', notes: '' });

  const { data, isLoading } = useQuery({ queryKey: ['service-orders'], queryFn: () => apiClient.get('/service-orders') });
  const createMutation = useMutation({
    mutationFn: (d: any) => apiClient.post('/service-orders', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['service-orders'] }); setDialogOpen(false); },
  });

  const orders: any[] = (data as any)?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3"><Wrench className="h-6 w-6 text-primary" /><h1 className="text-2xl font-bold tracking-tight">Ordens de Serviço</h1></div>
        <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Nova OS</Button>
      </div>
      {isLoading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div> : orders.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-muted-foreground"><Wrench className="mb-2 h-12 w-12" /><p className="text-sm">Nenhuma OS encontrada</p></div>
      ) : (
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <THead>
              <Tr><Th className="w-[30%]">Título</Th><Th className="w-[20%]">Status</Th><Th className="w-[20%]">Prioridade</Th><Th className="w-[30%]">Agendamento</Th></Tr>
            </THead>
            <TBody>
              {orders.map((o: any) => (
                <Tr key={o.id}>
                  <Td className="font-medium truncate">{o.title}</Td>
                  <Td><Badge className={statusColors[o.status] ?? ''}>{o.status}</Badge></Td>
                  <Td><Badge className={priorityColors[o.priority] ?? ''}>{o.priority}</Badge></Td>
                  <Td className="text-muted-foreground">{o.scheduledDate ? new Date(o.scheduledDate).toLocaleDateString('pt-BR') : '-'}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </div>
      )}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDialogOpen(false)} />
          <div className="relative z-50 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Nova Ordem de Serviço</h2>
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Dados da OS</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2"><Label>Título</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
                  <div className="space-y-1 col-span-2"><Label>Descrição</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                  <div className="space-y-1"><Label>Prioridade</Label><Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option value="LOW">Baixa</option><option value="NORMAL">Normal</option><option value="HIGH">Alta</option><option value="URGENT">Urgente</option></Select></div>
                  <div className="space-y-1"><Label>Agendamento</Label><Input type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} /></div>
                  <div className="space-y-1 col-span-2"><Label>Observações</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
                </CardContent>
              </Card>
              <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button><Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Criar</Button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
