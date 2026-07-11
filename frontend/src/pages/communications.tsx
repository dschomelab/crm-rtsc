import { useState } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

const typeIcons: Record<string, string> = { WHATSAPP: 'bg-green-100 text-green-700', EMAIL: 'bg-blue-100 text-blue-700', SMS: 'bg-purple-100 text-purple-700' };

export function CommunicationsPage() {
  const [typeFilter, setTypeFilter] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['communications', typeFilter],
    queryFn: () => apiClient.get(`/communications${typeFilter ? `?type=${typeFilter}` : ''}`),
  });
  const comms: any[] = (data as any)?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3"><MessageSquare className="h-6 w-6 text-primary" /><h1 className="text-2xl font-bold tracking-tight">Comunicações</h1></div>
      <div className="flex gap-2">
        {['', 'WHATSAPP', 'EMAIL', 'SMS'].map((t) => (
          <button key={t} onClick={() => setTypeFilter(t)} className={`rounded-md px-3 py-1 text-xs font-medium ${typeFilter === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}>{t || 'Todas'}</button>
        ))}
      </div>
      {isLoading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div> : comms.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-muted-foreground"><MessageSquare className="mb-2 h-12 w-12" /><p className="text-sm">Nenhuma comunicação registrada</p></div>
      ) : (
        <div className="space-y-2">{comms.map((c: any) => (
          <div key={c.id} className="flex items-start gap-3 rounded-lg border p-3">
            <Badge className={typeIcons[c.type] ?? ''}>{c.type}</Badge>
            <div className="flex-1"><p className="text-sm font-medium">{c.subject || c.toEmail || c.toPhone || '-'}</p><p className="text-xs text-muted-foreground">{c.content?.substring(0, 100)}</p></div>
            <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
        ))}</div>
      )}
    </div>
  );
}
