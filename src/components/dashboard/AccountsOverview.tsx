import { mockAccounts } from '@/data/mockData';
import { cn } from '@/lib/utils';
import {
  Building2,
  PiggyBank,
  Wallet,
  Utensils,
  TrendingUp,
  MoreHorizontal,
  Plus,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const iconMap: Record<string, React.ElementType> = {
  'building-2': Building2,
  'piggy-bank': PiggyBank,
  wallet: Wallet,
  utensils: Utensils,
  'trending-up': TrendingUp,
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export function AccountsOverview() {
  const [showBalances, setShowBalances] = useState(true);

  const totalBalance = mockAccounts
    .filter((a) => a.type !== 'credit_card')
    .reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6 opacity-0 animate-slide-up stagger-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Suas Contas</h3>
          <p className="text-sm text-muted-foreground">Saldo total disponível</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowBalances(!showBalances)}
          >
            {showBalances ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Total Balance */}
      <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4">
        <p className="text-sm text-muted-foreground">Patrimônio Total</p>
        <p className="mt-1 text-3xl font-bold tracking-tight">
          {showBalances ? formatCurrency(totalBalance) : '••••••'}
        </p>
      </div>

      {/* Accounts List */}
      <div className="space-y-2">
        {mockAccounts.map((account) => {
          const Icon = iconMap[account.icon] || Building2;
          return (
            <div
              key={account.id}
              className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-accent/50 cursor-pointer"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${account.color}20` }}
              >
                <Icon className="h-5 w-5" style={{ color: account.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{account.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {account.type.replace('_', ' ')}
                </p>
              </div>
              <p
                className={cn(
                  'font-semibold tabular-nums',
                  account.balance >= 0 ? 'text-foreground' : 'text-destructive'
                )}
              >
                {showBalances ? formatCurrency(account.balance) : '••••'}
              </p>
            </div>
          );
        })}
      </div>

      <Button variant="outline" className="w-full gap-2">
        <Plus className="h-4 w-4" />
        Adicionar Conta
      </Button>
    </div>
  );
}
