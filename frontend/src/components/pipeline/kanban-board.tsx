import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useState } from 'react';
import type { Lead, PipelineStage } from '@/types/auth';
import { KanbanColumn } from './kanban-column';
import { LeadCard } from './lead-card';

interface KanbanBoardProps {
  stages: PipelineStage[];
  leadsByStage: Record<string, Lead[]>;
  onMoveLead: (leadId: string, stageId: string) => void;
  onLeadClick: (leadId: string) => void;
}

export function KanbanBoard({ stages, leadsByStage, onMoveLead, onLeadClick }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const allLeads = Object.values(leadsByStage).flat();
  const activeLead = activeId ? allLeads.find((l) => l.id === activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const leadId = active.id as string;
    const stageId = over.id as string;
    const lead = allLeads.find((l) => l.id === leadId);
    if (lead && lead.stageId !== stageId) {
      onMoveLead(leadId, stageId);
    }
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex h-full gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            leads={leadsByStage[stage.id] ?? []}
            onLeadClick={onLeadClick}
          />
        ))}
      </div>
      <DragOverlay>
        {activeLead ? (
          <div className="w-72 opacity-90">
            <LeadCard lead={activeLead} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
