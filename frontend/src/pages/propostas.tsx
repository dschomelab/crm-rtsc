import { useState, useEffect } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { Search, Plus, FileText, Loader2, Trash2, Pencil, X, Send, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, THead, TBody, Tr, Th, Td } from '@/components/ui/table';
import { FormAlert } from '@/components/shared/form-error';
import { ApiError } from '@/services/api';
import { useProposals, useCreateProposal, useUpdateProposal, useSendProposal, useApproveProposal, useDeleteProposal } from '@/hooks/useProposals';
import { useCustomers } from '@/hooks/useCustomers';
import type { Customer, Proposal } from '@/types/auth';

const statusLabels: Record<string, string> = { DRAFT: 'Rascunho', SENT: 'Enviada', APPROVED: 'Aprovada', REJECTED: 'Recusada' };
const statusColors: Record<string, string> = { DRAFT: 'bg-gray-100 text-gray-700', SENT: 'bg-blue-100 text-blue-700', APPROVED: 'bg-green-100 text-green-700', REJECTED: 'bg-red-100 text-red-700' };

export function PropostasPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', customerId: '', validUntil: '', discount: 0, shipping: 0, terms: '', notes: '', items: [{ description: '', quantity: 1, unitPrice: 0 }] });
  const [formError, setFormError] = useState<string[] | null>(null);
  const navigate = useNavigate();
  const searchQuery = useSearch({ strict: false }) as {
    leadId?: string;
    customerId?: string;
    value?: string;
    stageId?: string;
    title?: string;
  };

  // Pre-fill form from query params when creating from lead
  useEffect(() => {
    const leadId = searchQuery.leadId;
    const customerId = searchQuery.customerId;
    const title = searchQuery.title;

    if (leadId && !editingId && dialogOpen) {
      setForm((prev) => ({
        ...prev,
        customerId: customerId || prev.customerId,
        title: title || `Proposta para ${leadId}`,
      }));
    }
  }, [searchQuery, editingId, dialogOpen]);

  const { data, isLoading } = useProposals({ search: search || undefined, status: statusFilter || undefined, page });
  const createProposal = useCreateProposal();
  const updateProposal = useUpdateProposal();
  const sendProposal = useSendProposal();
  const approveProposal = useApproveProposal();
  const deleteProposal = useDeleteProposal();
  const { data: customersData } = useCustomers({ limit: 200 });

  const proposals = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const customers = customersData?.data ?? [];

  function openNew() {
    // Clear query params when manually opening new proposal
    navigate({ to: '/propostas' });
    setEditingId(null);
    setForm({ title: '', customerId: '', validUntil: '', discount: 0, shipping: 0, terms: '', notes: '', items: [{ description: '', quantity: 1, unitPrice: 0 }] });
    setDialogOpen(true);
  }

  function openEdit(p: Proposal) {
    setEditingId(p.id);
    setForm({
      title: p.title, customerId: p.customerId, validUntil: p.validUntil?.split('T')[0] ?? '',
      discount: p.discount ?? 0, shipping: p.shipping ?? 0, terms: p.terms ?? '', notes: p.notes ?? '',
      items: p.items?.map(i => ({ description: i.description, quantity: i.quantity, unitPrice: i.unitPrice })) ?? [{ description: '', quantity: 1, unitPrice: 0 }],
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const data = { ...form, validUntil: form.validUntil || undefined, items: form.items.filter(i => i.description) };
    try {
      if (editingId) {
        await updateProposal.mutateAsync({ id: editingId, data });
      } else {
        await createProposal.mutateAsync(data);
      }
      setDialogOpen(false);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.messages : ['Erro ao salvar proposta.']);
    }
    setDialogOpen(false);
  }

  function addItem() { setForm({ ...form, items: [...form.items, { description: '', quantity: 1, unitPrice: 0 }] }); }

  function removeItem(i: number) { setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) }); }

  function updateItem(i: number, field: string, value: string | number) {
    const items = [...form.items];
    items[i] = { ...items[i], [field]: value };
    setForm({ ...form, items });
  }

  function calcItemTotal(qty: number, price: number) { return qty * price; }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Propostas</h1>
        </div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Nova Proposta</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar propostas..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-8" />
        </div>
        <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="w-40">
          <option value="">Todos os status</option>
          <option value="DRAFT">Rascunho</option>
          <option value="SENT">Enviada</option>
          <option value="APPROVED">Aprovada</option>
          <option value="REJECTED">Recusada</option>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : proposals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <FileText className="mb-2 h-12 w-12" />
          <p className="text-sm">Nenhuma proposta encontrada</p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <THead>
                <Tr>
                  <Th className="w-[25%]">Título</Th>
                  <Th className="w-[22%]">Cliente</Th>
                  <Th className="w-[12%]">Status</Th>
                  <Th className="w-[15%] text-right">Valor</Th>
                  <Th className="w-[8%]">Versão</Th>
                  <Th className="w-[18%] text-right">Ações</Th>
                </Tr>
              </THead>
              <TBody>
                {proposals.map((p: Proposal) => (
                  <Tr key={p.id}>
                    <Td className="font-medium truncate">{p.title}</Td>
                    <Td className="text-muted-foreground truncate">{p.customer?.name ?? '-'}</Td>
                    <Td><Badge className={statusColors[p.status]}>{statusLabels[p.status] ?? p.status}</Badge></Td>
                    <Td className="text-right font-medium">R$ {Number(p.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Td>
                    <Td className="text-muted-foreground">v{p.version}</Td>
                    <Td className="text-right">
                      {p.status === 'DRAFT' && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>}
                      {p.status === 'DRAFT' && <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-500" onClick={() => sendProposal.mutate(p.id)}><Send className="h-3.5 w-3.5" /></Button>}
                      {p.status === 'SENT' && <Button variant="ghost" size="icon" className="h-7 w-7 text-green-500" onClick={() => approveProposal.mutate({ id: p.id, data: { action: 'APPROVED' } })}><CheckCircle className="h-3.5 w-3.5" /></Button>}
                      {p.status === 'SENT' && <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => approveProposal.mutate({ id: p.id, data: { action: 'REJECTED', rejectedReason: 'Recusado' } })}><XCircle className="h-3.5 w-3.5" /></Button>}
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { if (confirm('Excluir proposta?')) deleteProposal.mutate(p.id); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button key={i} variant={page === i + 1 ? 'default' : 'outline'} size="sm" onClick={() => setPage(i + 1)}>{i + 1}</Button>
              ))}
            </div>
          )}
        </>
      )}

      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDialogOpen(false)} />
          <div className="relative z-50 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border bg-background p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editingId ? 'Editar' : 'Nova'} Proposta</h2>
              <Button variant="ghost" size="icon" onClick={() => setDialogOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações da Proposta</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label>Título *</Label>
                    <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Cliente</Label>
                    <Select value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} required>
                      <option value="">Selecione...</option>
                      {customers.map((c: Customer) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Validade</Label>
                    <DatePicker value={form.validUntil} onChange={(v) => setForm({ ...form, validUntil: v })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Desconto (R$)</Label>
                    <Input type="number" min="0" step="0.01" value={form.discount} onChange={(e) => setForm({ ...form, discount: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Frete (R$)</Label>
                    <Input type="number" min="0" step="0.01" value={form.shipping} onChange={(e) => setForm({ ...form, shipping: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Termos e Condições</Label>
                    <Textarea value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Observações</Label>
                    <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Itens</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>+ Item</Button>
                  {form.items.map((item, i) => (
                    <div key={i} className="flex items-end gap-2 rounded-md border bg-muted/20 p-2">
                      <div className="flex-1 space-y-1">
                        <Label className="text-xs">Descrição</Label>
                        <Input value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} className="h-8 text-sm" />
                      </div>
                      <div className="w-20 space-y-1">
                        <Label className="text-xs">Qtd</Label>
                        <Input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(i, 'quantity', parseInt(e.target.value) || 1)} className="h-8 text-sm" />
                      </div>
                      <div className="w-24 space-y-1">
                        <Label className="text-xs">Preço unit.</Label>
                        <Input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(i, 'unitPrice', parseFloat(e.target.value) || 0)} className="h-8 text-sm" />
                      </div>
                      <div className="w-20 pt-4 text-right text-xs text-muted-foreground">
                        = R$ {calcItemTotal(item.quantity, item.unitPrice).toFixed(2)}
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeItem(i)}><X className="h-3 w-3" /></Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <FormAlert messages={formError ?? []} />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={createProposal.isPending || updateProposal.isPending}>
                  {(createProposal.isPending || updateProposal.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
