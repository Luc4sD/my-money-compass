import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { usePrivacy } from '@/contexts/PrivacyContext';
import { debtors, getTotalDebtors } from '@/data/mockData';
import { Users, ChevronRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export function DebtorsWidget() {
  const { isPrivacyMode } = usePrivacy();
  const navigate = useNavigate();
  const totals = getTotalDebtors();
  const activeDebtors = debtors.filter(d => d.isActive).slice(0, 3);

  return (
    <Card className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: '350ms' }}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Quem Me Deve</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/debtors')}>
          Ver todos
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Summary */}
      <div className="mb-4 rounded-lg bg-emerald-500/10 p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">A receber</span>
          <span className={cn("text-lg font-bold text-emerald-600", isPrivacyMode && "blur-md")}>
            {formatCurrency(totals.totalRemaining)}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Progress value={totals.percentageReceived} className="h-2 flex-1" />
          <span className="text-xs text-muted-foreground">
            {totals.percentageReceived.toFixed(0)}% recebido
          </span>
        </div>
      </div>

      {/* Debtors List */}
      <div className="space-y-3">
        {activeDebtors.map((debtor) => {
          const remaining = debtor.totalAmount - debtor.paidAmount;
          const progress = (debtor.paidAmount / debtor.totalAmount) * 100;

          return (
            <div
              key={debtor.id}
              className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer"
              onClick={() => navigate('/debtors')}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-semibold text-primary">
                    {debtor.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{debtor.name}</p>
                  <div className="flex items-center gap-1">
                    <Progress value={progress} className="h-1 w-16" />
                    <span className="text-xs text-muted-foreground">{progress.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={cn("text-sm font-semibold text-emerald-600", isPrivacyMode && "blur-md")}>
                  {formatCurrency(remaining)}
                </p>
                {debtor.installments && (
                  <p className="text-xs text-muted-foreground">
                    {debtor.paidInstallments}/{debtor.installments}x
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {totals.count > 3 && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          +{totals.count - 3} devedores
        </p>
      )}
    </Card>
  );
}