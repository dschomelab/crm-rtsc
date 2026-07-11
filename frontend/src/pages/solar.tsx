import { useState } from 'react';
import { Sun, Zap, DollarSign, Leaf, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useCustomers } from '@/hooks/useCustomers';
import { apiClient } from '@/services/api';
import type { Customer } from '@/types/auth';

export function SolarPage() {
  const [customerId, setCustomerId] = useState('');
  const [averageKwh, setAverageKwh] = useState('');
  const [peakSunHours, setPeakSunHours] = useState('4.5');
  const [tariffValue, setTariffValue] = useState('0.85');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { data: customersData } = useCustomers({ limit: 200 });
  const customers = customersData?.data ?? [];

  async function handleSimulate() {
    if (!customerId || !averageKwh) return;
    setLoading(true);
    try {
      const res = await apiClient.post('/solar/simulate', {
        customerId,
        averageKwh: parseFloat(averageKwh),
        peakSunHours: parseFloat(peakSunHours),
        tariffValue: parseFloat(tariffValue),
      });
      setResult(res);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Sun className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Energia Solar</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Simulação</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                <option value="">Selecione...</option>
                {customers.map((c: Customer) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Consumo médio mensal (kWh)</Label>
              <Input type="number" min="0" value={averageKwh} onChange={(e) => setAverageKwh(e.target.value)} placeholder="Ex: 500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Horas de sol pico</Label>
                <Input type="number" min="0" step="0.1" value={peakSunHours} onChange={(e) => setPeakSunHours(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tarifa (R$/kWh)</Label>
                <Input type="number" min="0" step="0.01" value={tariffValue} onChange={(e) => setTariffValue(e.target.value)} />
              </div>
            </div>
            <Button onClick={handleSimulate} disabled={loading || !customerId || !averageKwh} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simular
            </Button>
          </div>
        </Card>

        {result && (
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Resultado</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border bg-muted/30 p-3 text-center">
                  <Zap className="mx-auto mb-1 h-5 w-5 text-yellow-500" />
                  <p className="text-2xl font-bold">{result.result.systemPowerKw}kW</p>
                  <p className="text-xs text-muted-foreground">Potência do Sistema</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3 text-center">
                  <Sun className="mx-auto mb-1 h-5 w-5 text-orange-500" />
                  <p className="text-2xl font-bold">{result.result.panelCount}</p>
                  <p className="text-xs text-muted-foreground">Painéis</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3 text-center">
                  <DollarSign className="mx-auto mb-1 h-5 w-5 text-green-500" />
                  <p className="text-2xl font-bold">
                    R$ {result.result.monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground">Economia Mensal</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3 text-center">
                  <Leaf className="mx-auto mb-1 h-5 w-5 text-green-600" />
                  <p className="text-2xl font-bold">{result.result.co2Avoided}t</p>
                  <p className="text-xs text-muted-foreground">CO₂ evitado/ano</p>
                </div>
              </div>

              <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Investimento Total</span>
                  <span className="font-medium">R$ {result.result.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payback</span>
                  <span className="font-medium">{result.result.paybackYears} anos</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Geração Estimada</span>
                  <span className="font-medium">{result.result.estimatedGeneration.toLocaleString('pt-BR')} kWh/mês</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Modelo Painel</span>
                  <span className="font-medium">{result.result.panelModel}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Inversor</span>
                  <span className="font-medium">{result.result.inverterModel}</span>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
