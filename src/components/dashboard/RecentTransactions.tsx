import { mockTransactions, mockCategories, mockAccounts } from '@/data/mockData';
import { cn } from '@/lib/utils';
import {
  Home,
  Utensils,
  Car,
  Gamepad2,
  HeartPulse,
  GraduationCap,
  Banknote,
  Laptop,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const iconMap: Record<string, React.ElementType> = {
  home: Home,
  utensils: Utensils,
  car: Car,
  'gamepad-2': Gamepad2,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  banknote: Banknote,
  laptop: Laptop,
  'trending-up': TrendingUp,
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (date: Date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Hoje';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Ontem';
  }
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};

export function RecentTransactions() {
  const transactions = [...mockTransactions].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6 opacity-0 animate-slide-up stagger-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Últimas Transações</h3>
          <p className="text-sm text-muted-foreground">
            {transactions.length} transações este mês
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        {transactions.slice(0, 6).map((transaction) => {
          const category = mockCategories.find(
            (c) => c.id === transaction.categoryId
          );
          const account = mockAccounts.find(
            (a) => a.id === transaction.accountId
          );
          const Icon = category ? iconMap[category.icon] || Banknote : Banknote;
          const isIncome = transaction.type === 'income';

          return (
            <div
              key={transaction.id}
              className="transaction-row group"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                style={{ backgroundColor: `${category?.color}20` }}
              >
                <Icon
                  className="h-5 w-5"
                  style={{ color: category?.color }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{transaction.description}</p>
                  {transaction.installmentInfo && (
                    <Badge variant="secondary" className="text-xs">
                      {transaction.installmentInfo.currentInstallment}/
                      {transaction.installmentInfo.totalInstallments}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{category?.name}</span>
                  <span>•</span>
                  <span>{account?.name}</span>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    'flex items-center gap-1 font-semibold tabular-nums',
                    isIncome ? 'amount-positive' : 'amount-negative'
                  )}
                >
                  {isIncome ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {isIncome ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(transaction.date)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Button variant="ghost" className="w-full">
        Ver todas as transações
      </Button>
    </div>
  );
}
