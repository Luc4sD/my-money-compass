import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePrivacy } from '@/contexts/PrivacyContext';
import { getCashFlowSummary } from '@/data/mockData';
import {
  TrendingUp,
  TrendingDown,
  Briefcase,
  Zap,
  Users,
  ChevronRight,
  Wallet,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export function CashFlowWidget() {
  const { isPrivacyMode } = usePrivacy();
  const navigate = useNavigate();
  const summary = getCashFlowSummary();

  const incomeBreakdown = [
    {
      label: 'Renda Fixa',
      value: summary.fixedIncome,
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Renda Variável',
      value: summary.variableIncome,
      icon: Zap,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Recebimentos',
      value: summary.debtorPayments,
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <Card className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: '400ms' }}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Fluxo de Caixa</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/cashflow')}>
          Detalhes
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Net Balance (Sobra) */}
      <div className={cn(
        "mb-4 rounded-lg p-4",
        summary.netBalance >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {summary.netBalance >= 0 ? (
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
            <span className="font-medium">Sobra do Mês</span>
          </div>
          <span className={cn(
            "text-xl font-bold",
            summary.netBalance >= 0 ? "text-emerald-600" : "text-red-600",
            isPrivacyMode && "blur-md"
          )}>
            {formatCurrency(summary.netBalance)}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Taxa de economia: {summary.savingsRate.toFixed(0)}%
        </p>
      </div>

      {/* Income Breakdown */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Composição da Receita
        </p>
        {incomeBreakdown.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", item.bgColor)}>
                <item.icon className={cn("h-4 w-4", item.color)} />
              </div>
              <span className="text-sm">{item.label}</span>
            </div>
            <span className={cn("text-sm font-medium", isPrivacyMode && "blur-md")}>
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <span className="text-sm font-medium">Total Entradas</span>
        <span className={cn("font-bold text-emerald-600", isPrivacyMode && "blur-md")}>
          {formatCurrency(summary.totalIncome)}
        </span>
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-sm font-medium">Total Saídas</span>
        <span className={cn("font-bold text-red-600", isPrivacyMode && "blur-md")}>
          -{formatCurrency(summary.totalExpenses)}
        </span>
      </div>
    </Card>
  );
}