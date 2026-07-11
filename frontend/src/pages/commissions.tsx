import { DollarSign, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, THead, TBody, Tr, Th, Td } from '@/components/ui/table';
import { apiClient } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function CommissionsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['commissions'], queryFn: () => apiClient.get('/commissions') });
  const payMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/commissions/${id}/pay`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['commissions'] }),
  });
  const commissions: any[] = (data as any)?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3"><DollarSign className="h-6 w-6 text-primary" /><h1 className="text-2xl font-bold tracking-tight">Comissões</h1></div>
      {isLoading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div> : commissions.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-muted-foreground"><DollarSign className="mb-2 h-12 w-12" /><p className="text-sm">Nenhuma comissão registrada</p></div>
      ) : (
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <THead>
              <Tr><Th className="w-[28%]">Proposta</Th><Th className="w-[18%]">Valor</Th><Th className="w-[14%]">Percentual</Th><Th className="w-[14%]">Status</Th><Th className="w-[26%]">Ações</Th></Tr>
            </THead>
            <TBody>
              {commissions.map((c: any) => (
                <Tr key={c.id}>
                  <Td className="font-mono text-xs">{c.proposalId?.substring(0, 8)}…</Td>
                  <Td className="font-medium">R$ {Number(c.value).toFixed(2)}</Td>
                  <Td>{c.percentage}%</Td>
                  <Td><Badge className={c.paidAt ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>{c.paidAt ? 'Paga' : 'Pendente'}</Badge></Td>
                  <Td>{!c.paidAt && <Button size="sm" variant="outline" onClick={() => payMutation.mutate(c.id)} disabled={payMutation.isPending}>Marcar paga</Button>}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </div>
      )}
    </div>
  );
}
