import { useDraggable } from '@dnd-kit/core';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Lead } from '@/types/auth';

const statusLabels: Record<string, string> = {
  NEW: 'Novo',
  CONTACTED: 'Contatado',
  QUALIFIED: 'Qualificado',
  PROPOSAL: 'Proposta',
  NEGOTIATION: 'Negociação',
  WON: 'Ganho',
  LOST: 'Perdido',
};

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  CONTACTED: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  QUALIFIED: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  PROPOSAL: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  NEGOTIATION: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  WON: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  LOST: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `há ${days}d`;
  if (hours > 0) return `há ${hours}h`;
  if (minutes > 0) return `há ${minutes}min`;
  return 'agora';
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
    data: { lead },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`cursor-grab rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold leading-tight">{lead.name}</h4>
          <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${statusColors[lead.status] ?? ''}`}>
            {statusLabels[lead.status] ?? lead.status}
          </span>
        </div>
        {lead.assignedBy && (
          <Avatar
            fallback={lead.assignedBy.name.charAt(0).toUpperCase()}
            className="h-6 w-6 shrink-0"
            title={lead.assignedBy.name}
          />
        )}
      </div>

      <div className="mt-1 space-y-1">
        {(lead.email || lead.phone) && (
          <p className="truncate text-xs text-muted-foreground">
            {lead.email ?? lead.phone}
          </p>
        )}
        {lead.value > 0 && (
          <p className="text-xs font-medium text-green-600 dark:text-green-400">
            {formatCurrency(lead.value)}
          </p>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {lead.source && (
            <Badge variant="secondary" className="text-[10px]">
              {lead.source}
            </Badge>
          )}
        </div>
        <span className="shrink-0 text-[10px] text-muted-foreground">
          {timeAgo(lead.createdAt)}
        </span>
      </div>
    </div>
  );
}
