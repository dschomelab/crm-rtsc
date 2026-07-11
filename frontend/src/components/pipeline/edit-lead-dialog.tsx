import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLead, useUpdateLead } from '@/hooks/useLeads';

interface EditLeadDialogProps {
  leadId: string | null;
  open: boolean;
  onClose: () => void;
}

export function EditLeadDialog({ leadId, open, onClose }: EditLeadDialogProps) {
  const { data: lead } = useLead(leadId);
  const updateLead = useUpdateLead();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', source: '', value: 0, notes: '',
  });

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        email: lead.email ?? '',
        phone: lead.phone ?? '',
        source: lead.source ?? '',
        value: lead.value ?? 0,
        notes: lead.notes ?? '',
      });
    }
  }, [lead]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!leadId) return;
    await updateLead.mutateAsync({
      id: leadId,
      data: {
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        source: form.source || undefined,
        value: form.value,
        notes: form.notes || undefined,
      },
    });
    onClose();
  }

  if (!open || !leadId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Editar Lead</h2>
        {!lead ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-source">Origem</Label>
              <Input
                id="edit-source"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-value">Valor</Label>
              <Input
                id="edit-value"
                type="number"
                min="0"
                step="0.01"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Observações</Label>
              <textarea
                id="edit-notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateLead.isPending}>
                {updateLead.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
