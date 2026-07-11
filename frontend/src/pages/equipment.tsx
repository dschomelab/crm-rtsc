import { useState } from 'react';
import { Cpu, Plus, Loader2, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, THead, TBody, Th, Tr, Td, TableEmpty, TableLoading } from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { equipmentService } from '@/services/equipment';

const equipmentTypes = ['INVERSOR', 'PAINEL', 'ESTRUTURA', 'CABO', 'OUTRO'] as const;

export function EquipmentPage() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [form, setForm] = useState({ name: '', type: 'INVERSOR', brand: '', model: '', power: 0, price: 0, warranty: 0, stock: 0 });

  const { data, isLoading } = useQuery({
    queryKey: ['equipments', typeFilter],
    queryFn: () => equipmentService.list(typeFilter ? { type: typeFilter } : undefined),
  });
  const equipments: any[] = (data as any) ?? [];

  const createMutation = useMutation({
    mutationFn: (d: any) => equipmentService.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['equipments'] }); closeDialog(); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, ...d }: any) => equipmentService.update(id, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['equipments'] }); closeDialog(); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => equipmentService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['equipments'] }),
  });

  function openCreate() { setEditing(null); setForm({ name: '', type: 'INVERSOR', brand: '', model: '', power: 0, price: 0, warranty: 0, stock: 0 }); setDialogOpen(true); }
  function openEdit(eq: any) { setEditing(eq); setForm({ name: eq.name, type: eq.type, brand: eq.brand ?? '', model: eq.model ?? '', power: eq.power ?? 0, price: eq.price ?? 0, warranty: eq.warranty ?? 0, stock: eq.stock ?? 0 }); setDialogOpen(true); }
  function closeDialog() { setDialogOpen(false); setEditing(null); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, power: Number(form.power), price: Number(form.price), warranty: Number(form.warranty), stock: Number(form.stock) };
    if (editing) updateMutation.mutate({ id: editing.id, ...payload });
    else createMutation.mutate(payload);
  }

  const typeColors: Record<string, string> = {
    INVERSOR: 'bg-blue-100 text-blue-700',
    PAINEL: 'bg-green-100 text-green-700',
    ESTRUTURA: 'bg-orange-100 text-orange-700',
    CABO: 'bg-purple-100 text-purple-700',
    OUTRO: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3"><Cpu className="h-6 w-6 text-primary" /><h1 className="text-2xl font-bold tracking-tight">Equipamentos</h1></div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Novo Equipamento</Button>
      </div>
      <div className="flex gap-3">
        <select
          className="flex h-10 w-64 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">Todos os tipos</option>
          {equipmentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <Table>
        <THead>
          <Tr><Th>Nome</Th><Th>Tipo</Th><Th>Marca</Th><Th>Modelo</Th><Th>Preço</Th><Th>Estoque</Th><Th className="w-24 text-right">Ações</Th></Tr>
        </THead>
        <TBody>
          {isLoading ? <TableLoading colSpan={7} /> : equipments.length === 0 ? <TableEmpty colSpan={7} /> : equipments.map((eq: any) => (
            <Tr key={eq.id}>
              <Td className="font-medium">{eq.name}</Td>
              <Td><Badge className={typeColors[eq.type] ?? ''}>{eq.type}</Badge></Td>
              <Td>{eq.brand ?? '-'}</Td>
              <Td>{eq.model ?? '-'}</Td>
              <Td>{eq.price != null ? `R$ ${Number(eq.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</Td>
              <Td>{eq.stock ?? 0}</Td>
              <Td className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(eq)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { if (confirm('Excluir equipamento?')) deleteMutation.mutate(eq.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogHeader><DialogTitle>{editing ? 'Editar Equipamento' : 'Novo Equipamento'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Informações do Equipamento</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="space-y-1"><Label>Tipo</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {equipmentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1"><Label>Marca</Label><Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
              <div className="space-y-1"><Label>Modelo</Label><Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></div>
              <div className="space-y-1"><Label>Potência (W)</Label><Input type="number" value={form.power} onChange={(e) => setForm({ ...form, power: Number(e.target.value) })} /></div>
              <div className="space-y-1"><Label>Preço (R$)</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
              <div className="space-y-1"><Label>Garantia (meses)</Label><Input type="number" value={form.warranty} onChange={(e) => setForm({ ...form, warranty: Number(e.target.value) })} /></div>
              <div className="space-y-1"><Label>Estoque</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} /></div>
            </CardContent>
          </Card>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>Cancelar</Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
