import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { debts, getTotalDebts } from '@/data/mockData';
import { 
  Landmark, 
  User, 
  CreditCard, 
  TrendingDown,
  ChevronRight,
  AlertTriangle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DebtType } from '@/types/finance';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const debtTypeConfig: Record<DebtType, { icon: typeof Landmark; label: string; color: string }> = {
  loan: { icon: Landmark, label: 'Empréstimo', color: 'text-orange-500' },
  financing: { icon: Landmark, label: 'Financiamento', color: 'text-blue-500' },
  credit_card_debt: { icon: CreditCard, label: 'Cartão de Crédito', color: 'text-rose-500' },
  personal: { icon: User, label: 'Pessoal', color: 'text-violet-500' },
  other: { icon: TrendingDown, label: 'Outros', color: 'text-gray-500' },
};

export function DebtsWidget() {
  const { totalDebt, totalPaid, totalRemaining, percentagePaid } = getTotalDebts();
  const activeDebts = debts.filter(d => d.isActive);

  const isHighDebt = totalRemaining > 10000;

  return (
    <Card className="opacity-0 animate-fade-in" style={{ animationDelay: '350ms' }}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base font-semibold">
          <span className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-rose-500" />
            Dívidas e Empréstimos
          </span>
          {isHighDebt && (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Resumo Total */}
        <div className="rounded-xl bg-gradient-to-r from-rose-500/10 to-orange-500/10 border border-rose-500/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total de Dívidas</span>
            <span className="text-xs font-medium text-emerald-500">
              {percentagePaid.toFixed(0)}% pago
            </span>
          </div>
          <p className="text-2xl font-bold text-rose-500">
            {formatCurrency(totalRemaining)}
          </p>
          <Progress 
            value={percentagePaid} 
            className="h-2 mt-3"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Pago: {formatCurrency(totalPaid)}</span>
            <span>Total: {formatCurrency(totalDebt)}</span>
          </div>
        </div>

        {/* Lista de Dívidas */}
        <div className="space-y-2">
          {activeDebts.slice(0, 3).map((debt) => {
            const config = debtTypeConfig[debt.type];
            const Icon = config.icon;
            const debtPercentage = (debt.paidAmount / debt.totalAmount) * 100;
            const remaining = debt.totalAmount - debt.paidAmount;

            return (
              <div
                key={debt.id}
                className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3 transition-colors hover:bg-secondary"
              >
                <div className={cn('rounded-lg bg-background p-2', config.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm truncate">{debt.name}</p>
                    <span className="text-sm font-semibold text-rose-500">
                      {formatCurrency(remaining)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">{debt.creditor}</span>
                    <span className="text-xs text-muted-foreground">
                      {debtPercentage.toFixed(0)}% pago
                    </span>
                  </div>
                  <Progress value={debtPercentage} className="h-1 mt-2" />
                </div>
              </div>
            );
          })}
        </div>

        {activeDebts.length > 3 && (
          <button className="flex items-center justify-center gap-1 w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
            Ver todas ({activeDebts.length})
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {activeDebts.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">🎉 Você não possui dívidas ativas!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
