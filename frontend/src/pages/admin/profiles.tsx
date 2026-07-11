import { useState } from 'react';
import { Shield, Plus, Loader2, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, THead, TBody, Th, Tr, Td, TableEmpty, TableLoading } from '@/components/ui/table';
import { BackButton } from '@/components/shared/back-button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';

export function AdminProfilesPage() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', description: '', isActive: true });

  const { data, isLoading } = useQuery({ queryKey: ['access-profiles'], queryFn: () => apiClient.get('/access-profiles') });
  const profiles: any[] = (data as any) ?? [];

  const createMutation = useMutation({
    mutationFn: (d: any) => apiClient.post('/access-profiles', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['access-profiles'] }); closeDialog(); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, ...d }: any) => apiClient.patch(`/access-profiles/${id}`, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['access-profiles'] }); closeDialog(); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/access-profiles/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['access-profiles'] }),
  });

  function openCreate() { setEditing(null); setForm({ name: '', description: '', isActive: true }); setDialogOpen(true); }
  function openEdit(p: any) { setEditing(p); setForm({ name: p.name, description: p.description ?? '', isActive: p.isActive ?? true }); setDialogOpen(true); }
  function closeDialog() { setDialogOpen(false); setEditing(null); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) updateMutation.mutate({ id: editing.id, ...form });
    else createMutation.mutate(form);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><BackButton /><Shield className="h-6 w-6 text-primary" /><h1 className="text-2xl font-bold tracking-tight">Perfis de Acesso</h1></div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Novo Perfil</Button>
      </div>
      <Table>
        <THead>
          <Tr><Th>Nome</Th><Th>Descrição</Th><Th>Ativo</Th><Th className="w-24 text-right">Ações</Th></Tr>
        </THead>
        <TBody>
          {isLoading ? <TableLoading colSpan={4} /> : profiles.length === 0 ? <TableEmpty colSpan={4} /> : profiles.map((p: any) => (
            <Tr key={p.id}>
              <Td className="font-medium">{p.name}</Td>
              <Td>{p.description ?? '-'}</Td>
              <Td><Badge className={p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>{p.isActive ? 'Sim' : 'Não'}</Badge></Td>
              <Td className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { if (confirm('Excluir perfil?')) deleteMutation.mutate(p.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogHeader><DialogTitle>{editing ? 'Editar Perfil' : 'Novo Perfil'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Dados do Perfil</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1 col-span-2"><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="space-y-1 col-span-2"><Label>Descrição</Label><textarea className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="space-y-1 col-span-2"><Label>Ativo</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value={form.isActive ? 'true' : 'false'} onChange={(e) => setForm({ ...form, isActive: e.target.value === 'true' })}>
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
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
