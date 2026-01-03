import { AppLayout } from '@/components/layout/AppLayout';
import { getCashFlow, getCashFlowSummary, getAllDebtorPayments, debtors } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { usePrivacy } from '@/contexts/PrivacyContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Briefcase,
  Zap,
  Users,
  Wallet,
  PiggyBank,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const formatCompact = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(v);

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

export default function CashFlow() {
  const { isPrivacyMode } = usePrivacy();
  const cashFlowData = getCashFlow(30).map((item) => ({
    ...item,
    date: item.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
    isPast: item.date <= new Date(),
  }));
  const summary = getCashFlowSummary();
  const recentPayments = getAllDebtorPayments().slice(0, 5);

  const futureBalance = cashFlowData[cashFlowData.length - 1]?.projectedBalance || 0;
  const currentBalance =
    cashFlowData.find(
      (d) => d.isPast && cashFlowData.indexOf(d) === cashFlowData.filter((x) => x.isPast).length - 1
    )?.balance || 0;

  const incomeBreakdown = [
    {
      name: 'Renda Fixa',
      value: summary.fixedIncome,
      icon: Briefcase,
      color: 'hsl(217, 91%, 60%)',
      description: 'Salário e rendimentos fixos',
    },
    {
      name: 'Renda Variável',
      value: summary.variableIncome,
      icon: Zap,
      color: 'hsl(38, 92%, 50%)',
      description: 'Freelance, extras',
    },
    {
      name: 'Recebimentos',
      value: summary.debtorPayments,
      icon: Users,
      color: 'hsl(158, 64%, 52%)',
      description: 'Pagamentos de devedores',
    },
  ];

  const chartData = incomeBreakdown.map((item) => ({
    name: item.name,
    valor: item.value,
    fill: item.color,
  }));

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Fluxo de Caixa</h1>
          <p className="text-muted-foreground">
            Projeção de entradas e saídas com separação por categoria
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo Atual</p>
                <p className={cn('text-xl font-bold', isPrivacyMode && 'blur-md')}>
                  {formatCurrency(currentBalance)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo Projetado</p>
                <p className={cn('text-xl font-bold', isPrivacyMode && 'blur-md')}>
                  {formatCurrency(futureBalance)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg',
                  summary.netBalance >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'
                )}
              >
                <PiggyBank
                  className={cn(
                    'h-5 w-5',
                    summary.netBalance >= 0 ? 'text-emerald-600' : 'text-red-600'
                  )}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sobra do Mês</p>
                <p
                  className={cn(
                    'text-xl font-bold',
                    summary.netBalance >= 0 ? 'text-emerald-600' : 'text-red-600',
                    isPrivacyMode && 'blur-md'
                  )}
                >
                  {formatCurrency(summary.netBalance)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Economia</p>
                <div className="flex items-center gap-2">
                  <Progress value={Math.max(0, summary.savingsRate)} className="h-2 w-16" />
                  <span className="text-lg font-bold">{summary.savingsRate.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Chart */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="mb-4 text-lg font-semibold">Projeção de Saldo</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(v: number) => formatCurrency(v)}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="hsl(158, 64%, 52%)"
                    fill="hsl(158, 64%, 52%)"
                    fillOpacity={0.2}
                    name="Saldo"
                  />
                  <Area
                    type="monotone"
                    dataKey="projectedBalance"
                    stroke="hsl(199, 89%, 48%)"
                    fill="hsl(199, 89%, 48%)"
                    fillOpacity={0.1}
                    strokeDasharray="5 5"
                    name="Projetado"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Income Breakdown */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Composição da Receita</h3>

            <div className="h-[200px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <XAxis type="number" tickFormatter={(v) => formatCompact(v)} className="text-xs" />
                  <YAxis type="category" dataKey="name" width={80} className="text-xs" />
                  <Tooltip
                    formatter={(v: number) => formatCurrency(v)}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="valor" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {incomeBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <item.icon className="h-4 w-4" style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <p className={cn('font-semibold', isPrivacyMode && 'blur-md')}>
                    {formatCurrency(item.value)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Receitas</span>
                <span className={cn('text-lg font-bold text-emerald-600', isPrivacyMode && 'blur-md')}>
                  {formatCurrency(summary.totalIncome)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-medium">Total Despesas</span>
                <span className={cn('text-lg font-bold text-red-600', isPrivacyMode && 'blur-md')}>
                  -{formatCurrency(summary.totalExpenses)}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Debtor Payments */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Últimos Recebimentos de Devedores
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {recentPayments.map((payment) => {
              const debtor = debtors.find((d) => d.id === payment.debtorId);
              return (
                <div
                  key={payment.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                    <span className="text-sm font-semibold text-emerald-600">
                      {debtor?.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{debtor?.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(payment.date)}</p>
                  </div>
                  <p className={cn('text-sm font-bold text-emerald-600', isPrivacyMode && 'blur-md')}>
                    +{formatCurrency(payment.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}