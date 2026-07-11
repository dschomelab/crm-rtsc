import { useState } from 'react';
import {
  Phone, Mail, FileText, MoveRight, Calendar, CheckSquare, Info, Trash2, Pencil, X, Check, type LucideIcon,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Activity } from '@/types/auth';

const activityIcons: Record<string, LucideIcon> = {
  PHONE_CALL: Phone,
  EMAIL: Mail,
  NOTE: FileText,
  STAGE_MOVE: MoveRight,
  MEETING: Calendar,
  TASK: CheckSquare,
  SYSTEM: Info,
};

function getActivityIcon(type: string): LucideIcon {
  return activityIcons[type] ?? Info;
}

function getActivityColor(type: string): string {
  switch (type) {
    case 'PHONE_CALL': return 'text-blue-500 bg-blue-50 dark:bg-blue-950';
    case 'EMAIL': return 'text-green-500 bg-green-50 dark:bg-green-950';
    case 'NOTE': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950';
    case 'STAGE_MOVE': return 'text-purple-500 bg-purple-50 dark:bg-purple-950';
    case 'MEETING': return 'text-orange-500 bg-orange-50 dark:bg-orange-950';
    case 'TASK': return 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950';
    default: return 'text-gray-500 bg-gray-50 dark:bg-gray-950';
  }
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) {
    const months = Math.floor(days / 30);
    return `há ${months} ${months === 1 ? 'mês' : 'meses'}`;
  }
  if (days > 0) return `há ${days} ${days === 1 ? 'dia' : 'dias'}`;
  if (hours > 0) return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  if (minutes > 0) return `há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  return 'agora mesmo';
}

interface TimelineProps {
  activities: Activity[];
  leadId?: string | null;
  onDeleteActivity?: (activityId: string) => void;
  onUpdateActivity?: (activityId: string, data: { type?: string; description?: string }) => void;
}

export function Timeline({ activities, onDeleteActivity, onUpdateActivity }: TimelineProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editType, setEditType] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const sorted = [...activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  function startEdit(activity: Activity) {
    setEditingId(activity.id);
    setEditType(activity.type);
    setEditDesc(activity.description ?? '');
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function saveEdit(activityId: string) {
    onUpdateActivity?.(activityId, { type: editType, description: editDesc || undefined });
    setEditingId(null);
  }

  if (sorted.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Nenhuma atividade registrada.
      </div>
    );
  }

  return (
    <div className="relative space-y-0">
      {sorted.map((activity, index) => {
        const Icon = getActivityIcon(activity.type);
        const isLast = index === sorted.length - 1;
        const isSystem = activity.type === 'LEAD_CREATED' || activity.type === 'STAGE_MOVE' || activity.type === 'SYSTEM';
        const isEditing = editingId === activity.id;

        return (
          <div key={activity.id} className="relative flex gap-3 pb-6">
            <div className="flex flex-col items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getActivityColor(activity.type)}`}>
                <Icon className="h-4 w-4" />
              </div>
              {!isLast && <div className="mt-1 w-px flex-1 bg-border" />}
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2">
                <Avatar
                  fallback={activity.user.name.charAt(0).toUpperCase()}
                  className="h-5 w-5"
                />
                <span className="text-sm font-medium">{activity.user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {timeAgo(activity.createdAt)}
                </span>
                <div className="ml-auto flex gap-0.5">
                  {!isSystem && !isEditing && onUpdateActivity && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-foreground"
                      onClick={() => startEdit(activity)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                  {!isSystem && !isEditing && onDeleteActivity && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => onDeleteActivity(activity.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              {isEditing ? (
                <div className="mt-2 space-y-2 rounded-md border bg-muted/30 p-2">
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm"
                  >
                    <option value="NOTE">Anotação</option>
                    <option value="EMAIL">Email</option>
                    <option value="PHONE_CALL">Ligação</option>
                    <option value="MEETING">Reunião</option>
                    <option value="TASK">Tarefa</option>
                  </select>
                  <Input
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Descrição..."
                    className="h-8 text-sm"
                  />
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" className="h-7 px-2" onClick={cancelEdit}>
                      <X className="mr-1 h-3 w-3" />
                      Cancelar
                    </Button>
                    <Button variant="default" size="sm" className="h-7 px-2" onClick={() => saveEdit(activity.id)}>
                      <Check className="mr-1 h-3 w-3" />
                      Salvar
                    </Button>
                  </div>
                </div>
              ) : (
                activity.description && (
                  <p className={`mt-1 text-sm ${isSystem ? 'italic text-muted-foreground' : 'text-muted-foreground'}`}>
                    {activity.description}
                  </p>
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
