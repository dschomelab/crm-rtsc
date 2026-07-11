import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, THead, TBody, Th, Tr, Td, TableEmpty, TableLoading } from '@/components/ui/table';
import { BackButton } from '@/components/shared/back-button';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api';

export function AdminAuditPage() {
  const [entityFilter, setEntityFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', entityFilter, actionFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (entityFilter) params.set('entity', entityFilter);
      if (actionFilter) params.set('action', actionFilter);
      const qs = params.toString();
      return apiClient.get(`/audit-logs${qs ? `?${qs}` : ''}`);
    },
  });

  const logs: any[] = (data as any) ?? [];

  const entities = [...new Set(logs.map((l: any) => l.entity).filter(Boolean))];
  const actions = [...new Set(logs.map((l: any) => l.action).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2"><BackButton /><ClipboardList className="h-6 w-6 text-primary" /><h1 className="text-2xl font-bold tracking-tight">Auditoria</h1></div>
      {!isLoading && logs.length > 0 && (
        <div className="flex gap-3">
          <select
            className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
          >
            <option value="">Todas entidades</option>
            {entities.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <select
            className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="">Todas ações</option>
            {actions.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      )}
      <Table>
        <THead>
          <Tr><Th>Data</Th><Th>Usuário</Th><Th>Ação</Th><Th>Entidade</Th><Th>Descrição</Th></Tr>
        </THead>
        <TBody>
          {isLoading ? <TableLoading colSpan={5} /> : logs.length === 0 ? <TableEmpty colSpan={5} /> : logs.map((l: any) => (
            <Tr key={l.id}>
              <Td className="whitespace-nowrap">{new Date(l.createdAt).toLocaleString('pt-BR')}</Td>
              <Td>{l.user?.name ?? l.user?.email ?? '-'}</Td>
              <Td><Badge variant="outline">{l.action}</Badge></Td>
              <Td>{l.entity}</Td>
              <Td className="max-w-xs truncate">{l.description ?? '-'}</Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
