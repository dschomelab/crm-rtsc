import { useDroppable } from '@dnd-kit/core';
import { LeadCard } from './lead-card';
import type { Lead, PipelineStage } from '@/types/auth';

interface KanbanColumnProps {
  stage: PipelineStage;
  leads: Lead[];
  onLeadClick: (leadId: string) => void;
}

export function KanbanColumn({ stage, leads, onLeadClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-lg border bg-muted/30">
      <div className="flex items-center justify-between border-b px-3 py-2.5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{stage.name}</h3>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[11px] font-medium text-muted-foreground">
            {leads.length}
          </span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {stage.probability}%
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 overflow-y-auto p-2 transition-colors ${
          isOver ? 'bg-primary/5' : ''
        }`}
        style={{ minHeight: 200 }}
      >
        {leads.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-8 text-xs text-muted-foreground">
            Nenhum lead
          </div>
        ) : (
          leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onClick={() => onLeadClick(lead.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
