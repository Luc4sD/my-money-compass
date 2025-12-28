import { AppLayout } from '@/components/layout/AppLayout';
import { getCashFlow } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function CashFlow() {
  const cashFlowData = getCashFlow(30).map(item => ({
    ...item,
    date: item.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
    isPast: item.date <= new Date()
  }));

  const futureBalance = cashFlowData[cashFlowData.length - 1]?.projectedBalance || 0;
  const currentBalance = cashFlowData.find(d => d.isPast && cashFlowData.indexOf(d) === cashFlowData.filter(x => x.isPast).length - 1)?.balance || 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Fluxo de Caixa</h1>
          <p className="text-muted-foreground">Projeção de entradas e saídas</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Calendar className="h-5 w-5 text-primary" /></div><div><p className="text-sm text-muted-foreground">Saldo Atual</p><p className="text-xl font-bold">{formatCurrency(currentBalance)}</p></div></div></Card>
          <Card className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-emerald-600" /></div><div><p className="text-sm text-muted-foreground">Saldo Projetado</p><p className="text-xl font-bold">{formatCurrency(futureBalance)}</p></div></div></Card>
          <Card className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><TrendingDown className="h-5 w-5 text-blue-600" /></div><div><p className="text-sm text-muted-foreground">Variação</p><p className="text-xl font-bold">{formatCurrency(futureBalance - currentBalance)}</p></div></div></Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Projeção de Saldo</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Area type="monotone" dataKey="balance" stroke="hsl(158, 64%, 52%)" fill="hsl(158, 64%, 52%)" fillOpacity={0.2} name="Saldo" />
                <Area type="monotone" dataKey="projectedBalance" stroke="hsl(199, 89%, 48%)" fill="hsl(199, 89%, 48%)" fillOpacity={0.1} strokeDasharray="5 5" name="Projetado" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
