import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Search, Filter, X, ChevronDown, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { KanbanBoard } from '@/components/pipeline/kanban-board';
import { LeadDrawer } from '@/components/pipeline/lead-drawer';
import { usePipelines } from '@/hooks/usePipeline';
import { useLeads, useMoveLead, useDeleteLead } from '@/hooks/useLeads';
import type { Lead, Pipeline } from '@/types/auth';

function PipelineSelector({
  pipelines,
  activeId,
  onSelect,
}: {
  pipelines: Pipeline[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const active = pipelines.find((p) => p.id === activeId);

  return (
    <div ref={ref} className="relative">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => setOpen(!open)}
      >
        {active?.name ?? 'Pipeline'}
        <ChevronDown className="h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          {pipelines.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${
                p.id === activeId ? 'bg-accent font-medium' : ''
              }`}
              onClick={() => {
                onSelect(p.id);
                setOpen(false);
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function PipelinePage() {
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterSource, setFilterSource] = useState('');
  const [filterMinValue, setFilterMinValue] = useState('');
  const [filterMaxValue, setFilterMaxValue] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const { data: pipelines, isLoading: pipelinesLoading } = usePipelines();
  const activePipeline = useMemo(
    () => pipelines?.find((p) => p.id === selectedPipelineId) ?? pipelines?.[0],
    [pipelines, selectedPipelineId],
  );

  useEffect(() => {
    if (pipelines && pipelines.length > 0 && !selectedPipelineId) {
      setSelectedPipelineId(pipelines[0].id);
    }
  }, [pipelines, selectedPipelineId]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: leadsData } = useLeads({
    pipelineId: activePipeline?.id,
    search: debouncedSearch || undefined,
    source: filterSource || undefined,
    minValue: filterMinValue ? Number(filterMinValue) : undefined,
    maxValue: filterMaxValue ? Number(filterMaxValue) : undefined,
    dateFrom: filterDateFrom || undefined,
    dateTo: filterDateTo || undefined,
  });

  const leadsByStage = useMemo(() => {
    if (!leadsData?.data || !activePipeline) return {};
    const grouped: Record<string, Lead[]> = {};
    for (const stage of activePipeline.stages) {
      grouped[stage.id] = leadsData.data.filter((lead) => lead.stageId === stage.id);
    }
    return grouped;
  }, [leadsData, activePipeline]);

  const moveLead = useMoveLead();
  const deleteLead = useDeleteLead();

  const handleMoveLead = useCallback(
    (leadId: string, stageId: string) => {
      moveLead.mutate({ id: leadId, stageId });
    },
    [moveLead],
  );

  const handleDeleteLead = useCallback(
    (id: string) => {
      deleteLead.mutate(id);
    },
    [deleteLead],
  );

  if (pipelinesLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-96 w-72 shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {pipelines && pipelines.length > 1 && activePipeline ? (
            <PipelineSelector
              pipelines={pipelines}
              activeId={activePipeline.id}
              onSelect={setSelectedPipelineId}
            />
          ) : (
            <h2 className="text-xl font-bold">{activePipeline?.name ?? 'Pipeline'}</h2>
          )}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar leads..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-64 pl-8"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={filtersOpen ? 'bg-accent' : ''}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filtersOpen && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Origem</span>
            <Input
              placeholder="Origem..."
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="h-8 w-36"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Valor</span>
            <Input
              type="number"
              placeholder="Mín"
              value={filterMinValue}
              onChange={(e) => setFilterMinValue(e.target.value)}
              className="h-8 w-24"
            />
            <span className="text-xs text-muted-foreground">—</span>
            <Input
              type="number"
              placeholder="Máx"
              value={filterMaxValue}
              onChange={(e) => setFilterMaxValue(e.target.value)}
              className="h-8 w-24"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Data</span>
            <Input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="h-8 w-36"
            />
            <span className="text-xs text-muted-foreground">—</span>
            <Input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="h-8 w-36"
            />
          </div>
          {(filterSource || filterMinValue || filterMaxValue || filterDateFrom || filterDateTo) && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setFilterSource('');
                setFilterMinValue('');
                setFilterMaxValue('');
                setFilterDateFrom('');
                setFilterDateTo('');
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {activePipeline ? (
          <KanbanBoard
            stages={activePipeline.stages}
            leadsByStage={leadsByStage}
            onMoveLead={handleMoveLead}
            onLeadClick={setSelectedLeadId}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <GitBranch className="h-12 w-12 text-muted-foreground/40" />
            Nenhum pipeline encontrado.
          </div>
        )}
      </div>

      <LeadDrawer
        leadId={selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
        onDelete={handleDeleteLead}
      />
    </div>
  );
}
