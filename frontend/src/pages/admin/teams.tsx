import { useState } from 'react';
import { Group, Plus, Loader2, Pencil, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, THead, TBody, Th, Tr, Td, TableEmpty, TableLoading } from '@/components/ui/table';
import { BackButton } from '@/components/shared/back-button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';

export function AdminTeamsPage() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', description: '', managerId: '' });

  const { data: teamsData, isLoading } = useQuery({ queryKey: ['teams'], queryFn: () => apiClient.get('/teams') });
  const { data: usersData } = useQuery({ queryKey: ['users'], queryFn: () => apiClient.get('/admin/users') });
  const teams: any[] = (teamsData as any) ?? [];
  const users: any[] = (usersData as any) ?? [];

  const createMutation = useMutation({
    mutationFn: (d: any) => apiClient.post('/teams', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['teams'] }); closeDialog(); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, ...d }: any) => apiClient.patch(`/teams/${id}`, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['teams'] }); closeDialog(); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/teams/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teams'] }),
  });

  function openCreate() { setEditing(null); setForm({ name: '', description: '', managerId: '' }); setDialogOpen(true); }
  function openEdit(t: any) { setEditing(t); setForm({ name: t.name, description: t.description ?? '', managerId: t.managerId ?? '' }); setDialogOpen(true); }
  function closeDialog() { setDialogOpen(false); setEditing(null); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.managerId) delete (payload as any).managerId;
    if (editing) updateMutation.mutate({ id: editing.id, ...payload });
    else createMutation.mutate(payload);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><BackButton /><Group className="h-6 w-6 text-primary" /><h1 className="text-2xl font-bold tracking-tight">Equipes</h1></div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Nova Equipe</Button>
      </div>
      <Table>
        <THead>
          <Tr><Th>Nome</Th><Th>Descrição</Th><Th>Gerente</Th><Th>Membros</Th><Th className="w-24 text-right">Ações</Th></Tr>
        </THead>
        <TBody>
          {isLoading ? <TableLoading colSpan={5} /> : teams.length === 0 ? <TableEmpty colSpan={5} /> : teams.map((t: any) => (
            <Tr key={t.id}>
              <Td className="font-medium">{t.name}</Td>
              <Td>{t.description ?? '-'}</Td>
              <Td>{t.manager?.name ?? '-'}</Td>
              <Td><span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{t._count?.members ?? t._count?.users ?? 0}</span></Td>
              <Td className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { if (confirm('Excluir equipe?')) deleteMutation.mutate(t.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogHeader><DialogTitle>{editing ? 'Editar Equipe' : 'Nova Equipe'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Dados da Equipe</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1 col-span-2"><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="space-y-1 col-span-2"><Label>Descrição</Label><textarea className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="space-y-1 col-span-2"><Label>Gerente</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value={form.managerId} onChange={(e) => setForm({ ...form, managerId: e.target.value })}>
                  <option value="">Selecione...</option>
                  {users.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
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
