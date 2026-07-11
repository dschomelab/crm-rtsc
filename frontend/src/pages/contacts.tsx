import { useState } from 'react';
import { Phone, Plus, Loader2, Pencil, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, THead, TBody, Th, Tr, Td, TableEmpty, TableLoading } from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactService } from '@/services/contact';
import { apiClient } from '@/services/api';

export function ContactsPage() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [customerFilter, setCustomerFilter] = useState('');
  const [form, setForm] = useState({ name: '', role: '', phone: '', email: '', isMain: false, customerId: '' });

  const { data: customersData } = useQuery({ queryKey: ['customers'], queryFn: () => apiClient.get('/customers') });
  const customers: any[] = (customersData as any)?.data ?? [];

  const { data, isLoading } = useQuery({
    queryKey: ['contacts', customerFilter],
    queryFn: () => contactService.list(customerFilter || undefined),
  });
  const contacts: any[] = (data as any) ?? [];

  const createMutation = useMutation({
    mutationFn: (d: any) => contactService.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['contacts'] }); closeDialog(); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, ...d }: any) => contactService.update(id, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['contacts'] }); closeDialog(); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }),
  });

  function openCreate() { setEditing(null); setForm({ name: '', role: '', phone: '', email: '', isMain: false, customerId: '' }); setDialogOpen(true); }
  function openEdit(c: any) { setEditing(c); setForm({ name: c.name, role: c.role ?? '', phone: c.phone ?? '', email: c.email ?? '', isMain: c.isMain ?? false, customerId: c.customerId ?? '' }); setDialogOpen(true); }
  function closeDialog() { setDialogOpen(false); setEditing(null); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) updateMutation.mutate({ id: editing.id, ...form });
    else createMutation.mutate(form);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3"><Phone className="h-6 w-6 text-primary" /><h1 className="text-2xl font-bold tracking-tight">Contatos</h1></div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Novo Contato</Button>
      </div>
      <div className="flex gap-3">
        <select
          className="flex h-10 w-64 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          value={customerFilter}
          onChange={(e) => setCustomerFilter(e.target.value)}
        >
          <option value="">Todos os clientes</option>
          {customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <Table>
        <THead>
          <Tr><Th>Nome</Th><Th>Função</Th><Th>Telefone</Th><Th>Email</Th><Th>Principal</Th><Th className="w-24 text-right">Ações</Th></Tr>
        </THead>
        <TBody>
          {isLoading ? <TableLoading colSpan={6} /> : contacts.length === 0 ? <TableEmpty colSpan={6} /> : contacts.map((c: any) => (
            <Tr key={c.id}>
              <Td className="font-medium">{c.name}</Td>
              <Td>{c.role ?? '-'}</Td>
              <Td>{c.phone ?? '-'}</Td>
              <Td>{c.email ?? '-'}</Td>
              <Td>{c.isMain ? <Star className="h-4 w-4 text-yellow-500" /> : '-'}</Td>
              <Td className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { if (confirm('Excluir contato?')) deleteMutation.mutate(c.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogHeader><DialogTitle>{editing ? 'Editar Contato' : 'Novo Contato'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Dados do Contato</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="space-y-1"><Label>Função</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
              <div className="space-y-1"><Label>Telefone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="space-y-1 col-span-2"><Label>Cliente</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} required>
                  <option value="">Selecione...</option>
                  {customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <input type="checkbox" id="isMain" checked={form.isMain} onChange={(e) => setForm({ ...form, isMain: e.target.checked })} className="h-4 w-4 rounded border-gray-300" />
                <Label htmlFor="isMain">Contato principal</Label>
              </div>
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
