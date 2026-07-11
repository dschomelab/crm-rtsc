import { useState, useEffect } from 'react';
import { Search, Plus, Building2, Loader2, Trash2, Pencil, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, THead, TBody, Tr, Th, Td } from '@/components/ui/table';
import { useCepLookup } from '@/hooks/useCepLookup';
import { FormAlert } from '@/components/shared/form-error';
import { ApiError } from '@/services/api';
import {
  useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer,
} from '@/hooks/useCustomers';
import type { Customer } from '@/types/auth';

interface FormData {
  name: string; email: string; phone: string; document: string; documentType: string;
  companyName: string; address: string; number: string; complement: string;
  city: string; state: string; zipCode: string; notes: string;
}

const EMPTY_FORM: FormData = {
  name: '', email: '', phone: '', document: '', documentType: 'PF',
  companyName: '', address: '', number: '', complement: '',
  city: '', state: '', zipCode: '', notes: '',
};

function formFromCustomer(c: Customer): FormData {
  return {
    name: c.name, email: c.email ?? '', phone: c.phone ?? '',
    document: c.document ?? '', documentType: c.documentType ?? 'PF',
    companyName: c.companyName ?? '', address: c.address ?? '',
    number: c.number ?? '', complement: c.complement ?? '',
    city: c.city ?? '', state: c.state ?? '', zipCode: c.zipCode ?? '',
    notes: c.notes ?? '',
  };
}

export function ClientesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string[] | null>(null);
  const { loadingCep, cepResult } = useCepLookup(form.zipCode);

  useEffect(() => {
    if (cepResult) {
      setForm((prev) => ({
        ...prev,
        address: cepResult.address || prev.address,
        city: cepResult.city || prev.city,
        state: cepResult.state || prev.state,
      }));
    }
  }, [cepResult]);

  const { data, isLoading } = useCustomers({ search: search || undefined, page });
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  function openNew() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(c: Customer) {
    setEditingId(c.id);
    setForm(formFromCustomer(c));
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    try {
      if (editingId) {
        await updateCustomer.mutateAsync({ id: editingId, data: form });
      } else {
        await createCustomer.mutateAsync(form);
      }
      setDialogOpen(false);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.messages : ['Erro ao salvar cliente.']);
    }
  }

  const customers = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> Novo Cliente
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Building2 className="mb-2 h-12 w-12" />
          <p className="text-sm">Nenhum cliente encontrado</p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <THead>
                <Tr>
                  <Th className="w-[25%]">Nome</Th>
                  <Th className="w-[18%]">Documento</Th>
                  <Th className="w-[22%]">Email</Th>
                  <Th className="w-[18%]">Telefone</Th>
                  <Th className="w-[7%] text-center">Leads</Th>
                  <Th className="w-[7%] text-center">Propostas</Th>
                  <Th className="w-[80px] text-right">Ações</Th>
                </Tr>
              </THead>
              <TBody>
                {customers.map((c: Customer) => (
                  <Tr key={c.id}>
                    <Td className="font-medium truncate">{c.name}</Td>
                    <Td className="text-muted-foreground truncate">
                      {c.document ? `${c.documentType === 'PJ' ? 'CNPJ' : 'CPF'} ${c.document}` : '-'}
                    </Td>
                    <Td className="text-muted-foreground truncate">{c.email ?? '-'}</Td>
                    <Td className="text-muted-foreground truncate">{c.phone ?? '-'}</Td>
                    <Td className="text-center">{c._count?.leads ?? 0}</Td>
                    <Td className="text-center">{c._count?.proposals ?? 0}</Td>
                    <Td className="text-right">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(c)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteCustomer.mutate(c.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
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
              <h2 className="text-lg font-semibold">{editingId ? 'Editar' : 'Novo'} Cliente</h2>
              <Button variant="ghost" size="icon" onClick={() => setDialogOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Dados do Cliente</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label>Nome Completo *</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={form.documentType} onChange={(e) => { setForm({ ...form, documentType: e.target.value, document: '' }); }}>
                      <option value="PF">Pessoa Física</option>
                      <option value="PJ">Pessoa Jurídica</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Documento</Label>
                    <MaskedInput mask="cpfCnpj" value={form.document} onChange={(v) => setForm({ ...form, document: v })} placeholder={form.documentType === 'PJ' ? 'CNPJ' : 'CPF'} />
                  </div>
                  {form.documentType === 'PJ' && (
                    <div className="space-y-2 col-span-2">
                      <Label>Razão Social</Label>
                      <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>E-mail</Label>
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone / WhatsApp</Label>
                    <MaskedInput mask="phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Endereço</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CEP</Label>
                    <div className="relative">
                      <MaskedInput mask="cep" value={form.zipCode} onChange={(v) => setForm({ ...form, zipCode: v })} />
                      {loadingCep && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
                      {!loadingCep && form.zipCode.replace(/\D/g, '').length === 8 && form.address && (
                        <MapPin className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Logradouro</Label>
                    <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Número</Label>
                    <Input value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Complemento</Label>
                    <Input value={form.complement} onChange={(e) => setForm({ ...form, complement: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Cidade</Label>
                    <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>

              <FormAlert messages={formError ?? []} />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={createCustomer.isPending || updateCustomer.isPending}>
                  {(createCustomer.isPending || updateCustomer.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
