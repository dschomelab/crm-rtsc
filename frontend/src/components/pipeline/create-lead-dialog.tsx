import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePipelines } from '@/hooks/usePipeline';
import type { PipelineStage } from '@/types/auth';

const createLeadSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  value: z.coerce.number().min(0).optional(),
  stageId: z.string().min(1, 'Estágio é obrigatório'),
});

type CreateLeadFormData = z.infer<typeof createLeadSchema>;

interface CreateLeadDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLeadFormData) => Promise<void>;
  isPending: boolean;
}

export function CreateLeadDialog({ open, onClose, onSubmit, isPending }: CreateLeadDialogProps) {
  const { data: pipelines } = usePipelines();
  const [stages, setStages] = useState<PipelineStage[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateLeadFormData>({
    resolver: zodResolver(createLeadSchema),
  });

  const selectedPipelineId = watch('stageId');

  useEffect(() => {
    if (pipelines && pipelines.length > 0) {
      const allStages = pipelines.flatMap((p) => p.stages);
      setStages(allStages);
      if (allStages.length > 0 && !selectedPipelineId) {
        reset({ stageId: allStages[0].id });
      }
    }
  }, [pipelines, selectedPipelineId, reset]);

  useEffect(() => {
    if (open) {
      reset({ name: '', email: '', phone: '', source: '', notes: '', value: 0, stageId: '' });
      if (stages.length > 0) {
        reset({ name: '', email: '', phone: '', source: '', notes: '', value: 0, stageId: stages[0].id });
      }
    }
  }, [open, reset, stages]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Novo Lead</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input id="name" placeholder="Nome do lead" {...register('name')} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="email@exemplo.com" {...register('email')} />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" placeholder="(11) 99999-9999" {...register('phone')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source">Origem</Label>
            <Input id="source" placeholder="Website, Indicação, etc." {...register('source')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Valor</Label>
            <Input id="value" type="number" step="0.01" placeholder="0,00" {...register('value')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stageId">Estágio *</Label>
            <select
              id="stageId"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              {...register('stageId')}
            >
              <option value="">Selecione um estágio</option>
              {stages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
            </select>
            {errors.stageId && (
              <p className="text-xs text-destructive">{errors.stageId.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <textarea
              id="notes"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              {...register('notes')}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar Lead
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
