import { useState } from 'react';
import { Users, Plus, Loader2, Pencil, Trash2 } from 'lucide-react';
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

export function AdminUsersPage() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER', profileId: '', teamId: '', isActive: true });

  const { data: usersData, isLoading } = useQuery({ queryKey: ['admin', 'users'], queryFn: () => apiClient.get('/admin/users') });
  const { data: profilesData } = useQuery({ queryKey: ['access-profiles'], queryFn: () => apiClient.get('/access-profiles') });
  const { data: teamsData } = useQuery({ queryKey: ['teams'], queryFn: () => apiClient.get('/teams') });

  const users: any[] = (usersData as any) ?? [];
  const profiles: any[] = (profilesData as any) ?? [];
  const teams: any[] = (teamsData as any) ?? [];

  const createMutation = useMutation({
    mutationFn: (d: any) => apiClient.post('/admin/users', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'users'] }); closeDialog(); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, ...d }: any) => apiClient.patch(`/admin/users/${id}`, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'users'] }); closeDialog(); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });

  function openCreate() {
    setEditing(null);
    setForm({ name: '', email: '', password: '', role: 'USER', profileId: '', teamId: '', isActive: true });
    setDialogOpen(true);
  }
  function openEdit(u: any) {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: '', role: u.role, profileId: u.profileId ?? '', teamId: u.teamId ?? '', isActive: u.isActive ?? true });
    setDialogOpen(true);
  }
  function closeDialog() { setDialogOpen(false); setEditing(null); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form };
    // Strip empty strings from optional UUID fields
    if (!payload.profileId) delete (payload as any).profileId;
    if (!payload.teamId) delete (payload as any).teamId;
    if (!payload.password) delete (payload as any).password;
    if (editing) {
      updateMutation.mutate({ id: editing.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><BackButton /><Users className="h-6 w-6 text-primary" /><h1 className="text-2xl font-bold tracking-tight">Usuários</h1></div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Novo Usuário</Button>
      </div>
      <Table>
        <THead>
          <Tr><Th>Nome</Th><Th>Email</Th><Th>Função</Th><Th>Perfil</Th><Th>Equipe</Th><Th>Ativo</Th><Th className="w-24 text-right">Ações</Th></Tr>
        </THead>
        <TBody>
          {isLoading ? <TableLoading colSpan={7} /> : users.length === 0 ? <TableEmpty colSpan={7} /> : users.map((u: any) => (
            <Tr key={u.id}>
              <Td className="font-medium">{u.name}</Td>
              <Td>{u.email}</Td>
              <Td><Badge variant={u.role === 'ADMIN' ? 'default' : u.role === 'MANAGER' ? 'secondary' : 'outline'}>{u.role}</Badge></Td>
              <Td>{u.profile?.name ?? '-'}</Td>
              <Td>{u.team?.name ?? '-'}</Td>
              <Td><Badge className={u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>{u.isActive ? 'Sim' : 'Não'}</Badge></Td>
              <Td className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(u)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { if (confirm('Excluir usuário?')) deleteMutation.mutate(u.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogHeader><DialogTitle>{editing ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Dados do Usuário</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
              {!editing && <div className="space-y-1"><Label>Senha</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>}
              <div className="space-y-1"><Label>Função</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="USER">Usuário</option>
                  <option value="MANAGER">Gerente</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div className="space-y-1"><Label>Perfil de Acesso</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value={form.profileId} onChange={(e) => setForm({ ...form, profileId: e.target.value })}>
                  <option value="">Selecione...</option>
                  {profiles.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="space-y-1"><Label>Equipe</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value={form.teamId} onChange={(e) => setForm({ ...form, teamId: e.target.value })}>
                  <option value="">Selecione...</option>
                  {teams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="space-y-1"><Label>Ativo</Label>
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
