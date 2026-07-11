import { Sparkles, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const typeIcons: Record<string, string> = { LEAD_SCORE: 'bg-purple-100 text-purple-700', FOLLOW_UP: 'bg-blue-100 text-blue-700', CROSS_SELL: 'bg-green-100 text-green-700', DISCOUNT: 'bg-orange-100 text-orange-700' };

export function AiSuggestionsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['ai-suggestions'], queryFn: () => apiClient.get('/ai-suggestions') });
  const readMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/ai-suggestions/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ai-suggestions'] }),
  });
  const suggestions: any[] = (data as any)?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3"><Sparkles className="h-6 w-6 text-primary" /><h1 className="text-2xl font-bold tracking-tight">Sugestões de IA</h1></div>
      {isLoading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div> : suggestions.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-muted-foreground"><Sparkles className="mb-2 h-12 w-12" /><p className="text-sm">Nenhuma sugestão disponível</p></div>
      ) : (
        <div className="space-y-2">{suggestions.map((s: any) => (
          <div key={s.id} className={`flex items-start gap-3 rounded-lg border p-3 ${!s.readAt ? 'border-primary/20 bg-primary/5' : ''}`}>
            <Badge className={typeIcons[s.type] ?? ''}>{s.type}</Badge>
            <div className="flex-1"><p className="text-sm font-medium">{s.title}</p>{s.description && <p className="text-xs text-muted-foreground">{s.description}</p>}{s.score != null && <p className="mt-1 text-xs text-muted-foreground">Score: {Number(s.score).toFixed(1)}</p>}</div>
            <div className="flex flex-col items-end gap-1">{!s.readAt && <Button size="sm" variant="ghost" onClick={() => readMutation.mutate(s.id)} disabled={readMutation.isPending} className="text-xs">OK</Button>}<span className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString('pt-BR')}</span></div>
          </div>
        ))}</div>
      )}
    </div>
  );
}
