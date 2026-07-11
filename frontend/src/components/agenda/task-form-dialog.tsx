import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { Lead } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { leadService } from '@/services/lead';

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  createActivity: {
    mutateAsync: (data: { leadId: string; data: { type: string; description?: string; dueDate?: string } }) => Promise<unknown>;
    isPending: boolean;
  };
}

export function TaskFormDialog({ open, onClose, createActivity }: TaskFormDialogProps) {
  const [type, setType] = useState('TASK');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [leadId, setLeadId] = useState('');

  const { data: leadsData } = useQuery({
    queryKey: ['leads-for-task'],
    queryFn: () => leadService.findAll({ limit: 100 }),
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      setType('TASK');
      setDescription('');
      setDueDate('');
      setLeadId('');
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    const targetLeadId = leadId || undefined;
    if (!targetLeadId) return;
    await createActivity.mutateAsync({
      leadId: targetLeadId,
      data: { type, description: description.trim(), dueDate: dueDate || undefined },
    });
    onClose();
  }

  if (!open) return null;

  const leads = leadsData?.data ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 w-full max-w-sm rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Nova Tarefa</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-type">Tipo</Label>
            <select
              id="task-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="TASK">Tarefa</option>
              <option value="NOTE">Anotação</option>
              <option value="EMAIL">Email</option>
              <option value="PHONE_CALL">Ligação</option>
              <option value="MEETING">Reunião</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-lead">Lead (opcional)</Label>
            <select
              id="task-lead"
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="">Selecione um lead...</option>
              {leads.map((l: Lead) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-desc">Descrição</Label>
            <Input
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a tarefa..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-date">Data de vencimento</Label>
            <Input
              id="task-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createActivity.isPending || !description.trim()}>
              {createActivity.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
