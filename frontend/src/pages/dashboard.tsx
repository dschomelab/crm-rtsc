import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, FileText, Wrench, MessageSquare, Loader2 } from 'lucide-react';
import { apiClient } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export function DashboardPage() {
  const { data: leads, isLoading: lLoading } = useQuery({ queryKey: ['leads-count'], queryFn: () => apiClient.get('/leads?limit=1').then(r => ({ total: (r as any).total || 0 })) });
  const { data: proposals, isLoading: pLoading } = useQuery({ queryKey: ['proposals-count'], queryFn: () => apiClient.get('/proposals?limit=1').then(r => ({ total: (r as any).total || 0 })) });
  const { data: os, isLoading: osLoading } = useQuery({ queryKey: ['os-count'], queryFn: () => apiClient.get('/service-orders').then(r => ({ total: ((r as any).data || []).length })) });
  const { data: comms, isLoading: commsLoading } = useQuery({ queryKey: ['comms-count'], queryFn: () => apiClient.get('/communications').then(r => ({ total: ((r as any).data || []).length })) });

  const loading = lLoading || pLoading || osLoading || commsLoading;

  const lTotal = (leads as any)?.total ?? 0;
  const pTotal = (proposals as any)?.total ?? 0;
  const osTotal = (os as any)?.total ?? 0;
  const commsTotal = (comms as any)?.total ?? 0;

  const metrics = [
    { title: 'Total de Leads', value: String(lTotal), icon: Users, description: 'Leads cadastrados' },
    { title: 'Propostas Ativas', value: String(pTotal), icon: FileText, description: 'Propostas registradas' },
    { title: 'Ordens de Serviço', value: String(osTotal), icon: Wrench, description: 'OS abertas' },
    { title: 'Comunicações', value: String(commsTotal), icon: MessageSquare, description: 'Registros recentes' },
  ];

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold tracking-tight">Dashboard</h2><p className="text-sm text-muted-foreground">Bem-vindo ao CRM RTSC. Acompanhe suas métricas principais.</p></div>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <Card key={m.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{m.title}</CardTitle>
                <m.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{m.value}</div>
                <p className="text-xs text-muted-foreground">{m.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
