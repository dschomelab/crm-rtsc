import { useState } from 'react';
import {
  Search, Plus, Users, Loader2, Trash2, Pencil, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table, THead, TBody, Tr, Th, Td,
} from '@/components/ui/table';
import { LeadDrawer } from '@/components/pipeline/lead-drawer';
import { FormAlert } from '@/components/shared/form-error';
import { ApiError } from '@/services/api';
import { useLeads, useCreateLead, useDeleteLead } from '@/hooks/useLeads';
import { usePipelines } from '@/hooks/usePipeline';
import { useCustomers } from '@/hooks/useCustomers';
import type { Lead } from '@/types/auth';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const statusLabels: Record<string, string> = {
  NEW: 'Novo', CONTACTED: 'Contactado', QUALIFIED: 'Qualificado',
  PROPOSAL: 'Proposta', CLOSED_WON: 'Ganho', CLOSED_LOST: 'Perdido',
};
const statusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700', CONTACTED: 'bg-yellow-100 text-yellow-700',
  QUALIFIED: 'bg-purple-100 text-purple-700', PROPOSAL: 'bg-orange-100 text-orange-700',
  CLOSED_WON: 'bg-green-100 text-green-700', CLOSED_LOST: 'bg-red-100 text-red-700',
};

const sortableColumns = ['name', 'value', 'status', 'createdAt'] as const;

export function LeadsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [formError, setFormError] = useState<string[] | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'status' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  function getSortDir(column: typeof sortableColumns[number]): 'asc' | 'desc' | null {
    if (sortBy !== column) return null;
    return sortOrder;
  }

  const { data: pipelines } = usePipelines();
  const firstPipeline = pipelines?.[0];

  const { data, isLoading } = useLeads({
    search: search || undefined,
    status: statusFilter || undefined,
    pipelineId: firstPipeline?.id,
    page,
    sortBy,
    sortOrder,
  });
  const createLead = useCreateLead();
  const deleteLead = useDeleteLead();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', source: '', value: 0, notes: '',
    customerId: '', pipelineId: '', stageId: '',
  });

  function handleSort(column: typeof sortableColumns[number]) {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setPage(1);
  }

  function openNew() {
    setForm({
      name: '', email: '', phone: '', source: '', value: 0, notes: '',
      customerId: '', pipelineId: firstPipeline?.id ?? '', stageId: firstPipeline?.stages?.[0]?.id ?? '',
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    try {
      await createLead.mutateAsync({
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        source: form.source || undefined,
        value: form.value || 0,
        notes: form.notes || undefined,
        customerId: form.customerId || undefined,
        pipelineId: form.pipelineId || undefined,
        stageId: form.stageId || undefined,
      });
      setDialogOpen(false);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.messages : ['Erro ao criar lead.']);
    }
  }

  const { data: customersData } = useCustomers({ limit: 200 });
  const customers = customersData?.data ?? [];
  const leads = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const stages = form.pipelineId
    ? pipelines?.find((p) => p.id === form.pipelineId)?.stages ?? []
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> Novo Lead
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar leads..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="w-40">
          <option value="">Todos os status</option>
          {Object.entries(statusLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Users className="mb-2 h-12 w-12" />
          <p className="text-sm">Nenhum lead encontrado</p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border overflow-x-auto">
<Table>
              <caption className="sr-only">Lista de leads</caption>
              <THead>
                <Tr>
                  <Th sortable sortDir={getSortDir('name')} onSort={() => handleSort('name')} className="w-[15%]">
                    Nome
                  </Th>
                  <Th className="w-[12%]">Cliente</Th>
                  <Th sortable sortDir={getSortDir('value')} onSort={() => handleSort('value')} className="w-[10%] text-right">
                    Valor
                  </Th>
                  <Th className="w-[12%]">Estágio</Th>
                  <Th className="w-[12%]">Pipeline</Th>
                  <Th className="w-[10%]">Responsável</Th>
                  <Th className="w-[10%]">Origem</Th>
                  <Th sortable sortDir={getSortDir('status')} onSort={() => handleSort('status')} className="w-[8%]">
                    Status
                  </Th>
                  <Th sortable sortDir={getSortDir('createdAt')} onSort={() => handleSort('createdAt')} className="w-[11%]">
                    Criado em
                  </Th>
                  <Th className="w-[80px] text-right">Ações</Th>
                </Tr>
              </THead>
              <TBody>
                {leads.map((lead: Lead) => (
                  <Tr key={lead.id} className="cursor-pointer" onClick={() => setSelectedLeadId(lead.id)}>
                    <Td className="font-medium truncate">{lead.name}</Td>
                    <Td className="text-muted-foreground truncate">
                      {lead.customer?.name ?? <span className="italic">—</span>}
                    </Td>
                    <Td className="text-right truncate">{lead.value > 0 ? formatCurrency(lead.value) : '-'}</Td>
                    <Td className="text-muted-foreground truncate">{lead.stage?.name ?? '-'}</Td>
                    <Td className="text-muted-foreground truncate">
                      {pipelines?.find((p) => p.id === lead.pipelineId)?.name ?? '-'}
                    </Td>
                    <Td className="text-muted-foreground truncate">{lead.assignedBy?.name ?? '-'}</Td>
                    <Td className="text-muted-foreground truncate">{lead.source ?? '-'}</Td>
                    <Td>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[lead.status] ?? 'bg-gray-100 text-gray-700'}`}>
                        {statusLabels[lead.status] ?? lead.status}
                      </span>
                    </Td>
                    <Td className="text-muted-foreground truncate">{formatDate(lead.createdAt)}</Td>
                    <Td className="text-right">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setSelectedLeadId(lead.id); }}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); deleteLead.mutate(lead.id); }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button key={i} variant={page === i + 1 ? 'default' : 'outline'} size="sm" onClick={() => setPage(i + 1)}>
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </>
      )}

      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDialogOpen(false)} />
          <div className="relative z-50 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg border bg-background p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Novo Lead</h2>
              <Button variant="ghost" size="icon" onClick={() => setDialogOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações do Lead</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label>Nome *</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Nome do lead" />
                  </div>
                  <div className="space-y-2">
                    <Label>E-mail</Label>
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@exemplo.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(11) 99999-9999" />
                  </div>
                  <div className="space-y-2">
                    <Label>Origem</Label>
                    <Input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="Website, Indicação..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor Estimado</Label>
                    <Input type="number" step="0.01" min="0" value={form.value} onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Observações</Label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pipeline</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cliente *</Label>
                    <select
                      value={form.customerId}
                      onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      required
                    >
                      <option value="">Selecione um cliente</option>
                      {customers.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pipeline</Label>
                    <select
                      value={form.pipelineId}
                      onChange={(e) => {
                        const pipeline = pipelines?.find((p) => p.id === e.target.value);
                        setForm({ ...form, pipelineId: e.target.value, stageId: pipeline?.stages?.[0]?.id ?? '' });
                      }}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {pipelines?.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Estágio</Label>
                    <select
                      value={form.stageId}
                      onChange={(e) => setForm({ ...form, stageId: e.target.value })}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {stages.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>

              <FormAlert messages={formError ?? []} className="mb-2" />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={createLead.isPending}>
                  {createLead.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Criar Lead
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <LeadDrawer
        leadId={selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
        onDelete={(id) => { deleteLead.mutate(id); setSelectedLeadId(null); }}
      />
    </div>
  );
}
