import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  X, Phone, Mail, User, DollarSign, FileText, Trash2, Send, Loader2, Plus, Pencil, Paperclip, Download,
  MessageCircle, Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Timeline } from './timeline';
import { EditLeadDialog } from './edit-lead-dialog';
import { useLead } from '@/hooks/useLeads';
import { useActivities, useCreateActivity, useDeleteActivity, useUpdateActivity } from '@/hooks/useActivities';
import { useTags, useCreateTag, useAddTagToLead, useRemoveTagFromLead } from '@/hooks/useTags';
import { useObservations, useCreateObservation, useDeleteObservation } from '@/hooks/useObservations';
import { useAttachments, useUploadAttachment, useDeleteAttachment } from '@/hooks/useAttachments';
import type { LeadTag, Attachment } from '@/types/auth';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileUrl(fileName: string): string {
  return `${API_URL.replace('/api/v1', '')}/uploads/${fileName}`;
}

interface LeadDrawerProps {
  leadId: string | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export function LeadDrawer({ leadId, onClose, onDelete }: LeadDrawerProps) {
  const { data: lead, isLoading } = useLead(leadId);
  const { data: activities } = useActivities(leadId);
  const { data: allTags } = useTags();
  const { data: observations } = useObservations(leadId);
  const { data: attachments } = useAttachments(leadId);
  const createActivity = useCreateActivity();
  const deleteActivity = useDeleteActivity();
  const updateActivity = useUpdateActivity();
  const createTag = useCreateTag();
  const addTag = useAddTagToLead();
  const removeTag = useRemoveTagFromLead();
  const createObservation = useCreateObservation();
  const deleteObservation = useDeleteObservation();
  const uploadAttachment = useUploadAttachment();
  const deleteAttachment = useDeleteAttachment();
  const navigate = useNavigate();

  const [activityType, setActivityType] = useState('NOTE');
  const [activityDesc, setActivityDesc] = useState('');
  const [obsInput, setObsInput] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const open = !!leadId;

  function handleCreateProposal() {
    if (!lead) return;
    const params = new URLSearchParams();
    params.set('leadId', lead.id);
    if (lead.customerId) params.set('customerId', lead.customerId);
    if (lead.value && lead.value > 0) params.set('value', String(lead.value));
    if (lead.stageId) params.set('stageId', lead.stageId);
    params.set('title', `Proposta para ${lead.name}`);
    navigate({ to: '/propostas', search: params });
    onClose();
  }

  async function handleAddActivity() {
    if (!leadId || !activityDesc.trim()) return;
    await createActivity.mutateAsync({ leadId, data: { type: activityType, description: activityDesc.trim() } });
    setActivityDesc('');
  }

  function handleDeleteActivity(activityId: string) {
    if (!leadId) return;
    deleteActivity.mutate({ leadId, id: activityId });
  }

  function handleUpdateActivity(activityId: string, data: { type?: string; description?: string }) {
    if (!leadId) return;
    updateActivity.mutate({ leadId, id: activityId, data });
  }

  async function handleAddTag(tagId: string) {
    if (!leadId) return;
    addTag.mutate({ leadId, tagId });
  }

  function handleRemoveTag(tagId: string) {
    if (!leadId) return;
    removeTag.mutate({ leadId, tagId });
  }

  async function handleCreateTag() {
    if (!newTagName.trim()) return;
    const tag = await createTag.mutateAsync({ name: newTagName.trim() });
    setNewTagName('');
    if (leadId && tag) handleAddTag(tag.id);
  }

  async function handleAddObservation() {
    if (!leadId || !obsInput.trim()) return;
    await createObservation.mutateAsync({ leadId, content: obsInput.trim() });
    setObsInput('');
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!leadId || !e.target.files?.length) return;
    await uploadAttachment.mutateAsync({ leadId, file: e.target.files[0] });
    e.target.value = '';
  }

  function handleDeleteAttachment(id: string) {
    deleteAttachment.mutate(id);
  }

  function handleDelete() {
    if (!leadId) return;
    onDelete?.(leadId);
    onClose();
  }

  if (!open) return null;

  const existingTagIds = new Set(lead?.tags?.map((lt: LeadTag) => lt.tagId) ?? []);
  const availableTags = allTags?.filter((t) => !existingTagIds.has(t.id)) ?? [];

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-50 flex w-full max-w-md flex-col bg-background shadow-xl">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : lead ? (
          <>
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-lg font-semibold">{lead.name}</h2>
              <div className="flex items-center gap-1">
                {lead.stage?.type === 'PROPOSAL' && (
                  <Button variant="outline" size="sm" onClick={handleCreateProposal} className="gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    Nova Proposta
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => setEditDialogOpen(true)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-4 p-4">
                <div className="flex items-center gap-3">
                  <Avatar fallback={lead.name.charAt(0).toUpperCase()} className="h-12 w-12 text-lg" />
                  <div>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                    <p className="text-sm text-muted-foreground">{lead.phone}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {lead.source && <Badge variant="secondary">{lead.source}</Badge>}
                  {lead.stage && <Badge>{lead.stage.name}</Badge>}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {lead.phone && (() => {
                    const phoneDigits = lead.phone.replace(/\D/g, '');
                    return (<>
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => window.open(`tel:${lead.phone}`)}>
                      <Phone className="h-3.5 w-3.5" /> Ligar
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => window.open(`https://wa.me/${phoneDigits}`)}>
                      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                    </Button>
                    </>);
                  })()}
                  {lead.email && (
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => window.open(`mailto:${lead.email}`)}>
                      <Mail className="h-3.5 w-3.5" /> E-mail
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => {}}>
                    <Calendar className="h-3.5 w-3.5" /> Visita
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Detalhes</h3>
                  <div className="space-y-2">
                    <DetailRow icon={Mail} label="Email" value={lead.email ?? '-'} />
                    <DetailRow icon={Phone} label="Telefone" value={lead.phone ?? '-'} />
                    <DetailRow icon={User} label="Atribuído a" value={lead.assignedBy?.name ?? '-'} />
                    <DetailRow icon={DollarSign} label="Valor" value={lead.value > 0 ? formatCurrency(lead.value) : '-'} />
                    <DetailRow icon={FileText} label="Observações" value={lead.notes ?? '-'} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.tags && lead.tags.length > 0 ? lead.tags.map((lt: LeadTag) => (
                      <Badge
                        key={lt.tagId}
                        variant="secondary"
                        className="gap-1 pr-1"
                        style={lt.tag.color ? { backgroundColor: lt.tag.color + '20', borderColor: lt.tag.color } : undefined}
                      >
                        {lt.tag.name}
                        <button
                          onClick={() => handleRemoveTag(lt.tagId)}
                          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )) : (
                      <p className="text-xs text-muted-foreground">Nenhuma tag</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {availableTags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => handleAddTag(tag.id)}
                        className="inline-flex items-center gap-1 rounded-full border border-dashed px-2 py-0.5 text-xs text-muted-foreground hover:border-solid hover:text-foreground"
                      >
                        <Plus className="h-3 w-3" />
                        {tag.name}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nova tag..."
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleCreateTag();
                        }
                      }}
                      className="h-8 text-xs"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8"
                      onClick={handleCreateTag}
                      disabled={!newTagName.trim() || createTag.isPending}
                    >
                      {createTag.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                      Criar
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Anexos</h3>
                  {attachments && attachments.length > 0 ? (
                    <div className="space-y-1">
                      {attachments.map((att: Attachment) => (
                        <div key={att.id} className="flex items-center gap-2 rounded-md border bg-muted/30 px-2 py-1.5">
                          <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <div className="flex-1 truncate text-sm">{att.originalName}</div>
                          <span className="shrink-0 text-xs text-muted-foreground">{formatFileSize(att.size)}</span>
                          <a
                            href={getFileUrl(att.fileName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-muted-foreground hover:text-foreground"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </a>
                          <button
                            onClick={() => handleDeleteAttachment(att.id)}
                            className="shrink-0 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Nenhum anexo</p>
                  )}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => document.getElementById('file-upload-input')?.click()}
                      disabled={uploadAttachment.isPending}
                    >
                      {uploadAttachment.isPending ? (
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      ) : (
                        <Paperclip className="mr-2 h-3 w-3" />
                      )}
                      Anexar arquivo
                    </Button>
                    <input
                      id="file-upload-input"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Observações</h3>
                  {observations && observations.length > 0 ? (
                    <div className="space-y-2">
                      {observations.map((obs) => (
                        <div key={obs.id} className="rounded-md border bg-muted/30 p-2">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium">{obs.user.name}</span> &mdash; {new Date(obs.createdAt).toLocaleString('pt-BR')}
                            </p>
                            <button
                              onClick={() => deleteObservation.mutate({ id: obs.id, leadId: lead.id })}
                              className="shrink-0 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="mt-1 text-sm">{obs.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Nenhuma observação</p>
                  )}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nova observação..."
                      value={obsInput}
                      onChange={(e) => setObsInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddObservation();
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      onClick={handleAddObservation}
                      disabled={!obsInput.trim() || createObservation.isPending}
                    >
                      {createObservation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Timeline</h3>
                  <Timeline
                    activities={activities ?? []}
                    leadId={leadId}
                    onDeleteActivity={handleDeleteActivity}
                    onUpdateActivity={handleUpdateActivity}
                  />

                  <div className="space-y-2 pt-2">
                    <Label htmlFor="activity-type">Tipo de atividade</Label>
                    <select
                      id="activity-type"
                      value={activityType}
                      onChange={(e) => setActivityType(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="NOTE">Anotação</option>
                      <option value="EMAIL">Email</option>
                      <option value="PHONE_CALL">Ligação</option>
                      <option value="MEETING">Reunião</option>
                      <option value="TASK">Tarefa</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Descreva a atividade..."
                      value={activityDesc}
                      onChange={(e) => setActivityDesc(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddActivity();
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      onClick={handleAddActivity}
                      disabled={!activityDesc.trim() || createActivity.isPending}
                    >
                      {createActivity.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t p-4">
              <Button variant="destructive" size="sm" className="w-full" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Lead
              </Button>
            </div>

            <EditLeadDialog
              leadId={leadId}
              open={editDialogOpen}
              onClose={() => setEditDialogOpen(false)}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}
