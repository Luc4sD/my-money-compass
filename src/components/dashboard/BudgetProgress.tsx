import { mockBudgets, mockCategories } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export function BudgetProgress() {
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6 opacity-0 animate-slide-up stagger-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Orçamentos</h3>
          <p className="text-sm text-muted-foreground">Dezembro 2024</p>
        </div>
        <Button variant="ghost" size="icon-sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {mockBudgets.map((budget) => {
          const category = mockCategories.find((c) => c.id === budget.categoryId);
          const percentage = (budget.spent / budget.amount) * 100;
          const isOverBudget = percentage >= 100;
          const isWarning = percentage >= 80 && percentage < 100;

          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: category?.color }}
                  />
                  <span className="font-medium">{category?.name}</span>
                  {isOverBudget && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  {!isOverBudget && percentage >= 50 && (
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isOverBudget && 'text-destructive',
                      isWarning && 'text-warning'
                    )}
                  >
                    {formatCurrency(budget.spent)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {' '}/ {formatCurrency(budget.amount)}
                  </span>
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className={cn(
                    'progress-bar-fill',
                    isOverBudget && '!bg-destructive',
                    isWarning && '!bg-warning'
                  )}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {isOverBudget
                  ? `Excedeu ${formatCurrency(budget.spent - budget.amount)}`
                  : `Restam ${formatCurrency(budget.amount - budget.spent)}`}
              </p>
            </div>
          );
        })}
      </div>

      <Button variant="outline" className="w-full gap-2">
        <Plus className="h-4 w-4" />
        Novo Orçamento
      </Button>
    </div>
  );
}
