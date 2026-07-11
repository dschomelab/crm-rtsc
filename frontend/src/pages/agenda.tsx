import { useState, useMemo } from 'react';
import {
  Calendar, Plus, CheckCircle2, Circle, Loader2, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaskFormDialog } from '@/components/agenda/task-form-dialog';
import { useMyActivities, useCompleteActivity } from '@/hooks/useMyActivities';
import { useCreateActivity } from '@/hooks/useActivities';
import type { Activity } from '@/types/auth';

const activityTypeLabels: Record<string, string> = {
  NOTE: 'Anotação',
  EMAIL: 'Email',
  PHONE_CALL: 'Ligação',
  MEETING: 'Reunião',
  TASK: 'Tarefa',
};

const activityTypeColors: Record<string, string> = {
  PHONE_CALL: 'text-blue-500 bg-blue-50 dark:bg-blue-950',
  EMAIL: 'text-green-500 bg-green-50 dark:bg-green-950',
  NOTE: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950',
  MEETING: 'text-orange-500 bg-orange-50 dark:bg-orange-950',
  TASK: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950',
};

export function AgendaPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [filterType, setFilterType] = useState<string>('');
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const dateFrom = useMemo(() => {
    const d = new Date(currentYear, currentMonth, 1);
    return d.toISOString().split('T')[0];
  }, [currentMonth, currentYear]);

  const dateTo = useMemo(() => {
    const d = new Date(currentYear, currentMonth + 1, 0);
    return d.toISOString().split('T')[0];
  }, [currentMonth, currentYear]);

  const { data: activities, isLoading } = useMyActivities({
    dateFrom,
    dateTo,
    status: filterStatus as 'pending' | 'completed' | 'all',
    type: filterType || undefined,
  });

  const completeActivity = useCompleteActivity();
  const createActivity = useCreateActivity();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const activitiesByDay = useMemo(() => {
    const map: Record<number, Activity[]> = {};
    if (!activities) return map;
    for (const act of activities) {
      if (act.dueDate) {
        const day = new Date(act.dueDate).getDate();
        if (!map[day]) map[day] = [];
        map[day].push(act);
      }
    }
    return map;
  }, [activities]);

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  }

  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  }

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  const pending = activities?.filter(a => !a.completedAt) ?? [];
  const completed = activities?.filter(a => a.completedAt) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
        </div>
        <Button onClick={() => setTaskDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-md border p-1">
          {['pending', 'completed', 'all'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                filterStatus === s
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              {s === 'pending' ? 'Pendentes' : s === 'completed' ? 'Concluídas' : 'Todas'}
            </button>
          ))}
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-8 rounded-md border border-input bg-background px-2 text-xs"
        >
          <option value="">Todos os tipos</option>
          {Object.entries(activityTypeLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-semibold">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-7 gap-px bg-muted">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
                <div key={d} className="bg-card px-2 py-1.5 text-center text-xs font-medium text-muted-foreground">
                  {d}
                </div>
              ))}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-card p-2" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayActs = activitiesByDay[day];
                const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                return (
                  <div
                    key={day}
                    className={`min-h-[80px] bg-card p-1.5 ${
                      isToday ? 'ring-1 ring-inset ring-primary' : ''
                    }`}
                  >
                    <span className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                      {day}
                    </span>
                    {dayActs && (
                      <div className="mt-1 space-y-0.5">
                        {dayActs.slice(0, 3).map((act) => (
                          <div
                            key={act.id}
                            className={`truncate rounded px-1 py-0.5 text-[10px] ${activityTypeColors[act.type] ?? 'text-gray-500 bg-gray-50'} ${act.completedAt ? 'line-through opacity-50' : ''}`}
                          >
                            {act.description ?? activityTypeLabels[act.type] ?? act.type}
                          </div>
                        ))}
                        {dayActs.length > 3 && (
                          <div className="text-[10px] text-muted-foreground">+{dayActs.length - 3} mais</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold">
              Pendentes ({pending.length})
            </h3>
            <div className="space-y-2">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : pending.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Nenhuma tarefa pendente
                </p>
              ) : (
                pending.map((act) => (
                  <ActivityCard
                    key={act.id}
                    activity={act}
                    onComplete={() => completeActivity.mutate(act.id)}
                  />
                ))
              )}
            </div>
          </div>

          {completed.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                Concluídas ({completed.length})
              </h3>
              <div className="space-y-2">
                {completed.map((act) => (
                  <ActivityCard
                    key={act.id}
                    activity={act}
                    onComplete={() => completeActivity.mutate(act.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <TaskFormDialog
        open={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
        createActivity={createActivity}
      />
    </div>
  );
}

function ActivityCard({ activity, onComplete }: { activity: Activity; onComplete: () => void }) {
  const isCompleted = !!activity.completedAt;
  return (
    <div className="flex items-start gap-2 rounded-lg border bg-card p-3">
      <button
        onClick={onComplete}
        className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary"
      >
        {isCompleted ? (
          <CheckCircle2 className="h-4 w-4 text-primary" />
        ) : (
          <Circle className="h-4 w-4" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${activityTypeColors[activity.type]?.split(' ')[0] ?? ''}`}>
            {activityTypeLabels[activity.type] ?? activity.type}
          </span>
          {activity.lead && (
            <Badge variant="outline" className="text-[10px] px-1 py-0">
              {activity.lead.name}
            </Badge>
          )}
        </div>
        {activity.description && (
          <p className={`mt-0.5 text-sm ${isCompleted ? 'text-muted-foreground line-through' : ''}`}>
            {activity.description}
          </p>
        )}
        {activity.dueDate && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {new Date(activity.dueDate).toLocaleDateString('pt-BR')}
          </p>
        )}
      </div>
    </div>
  );
}
