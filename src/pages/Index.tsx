import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AccountsOverview } from '@/components/dashboard/AccountsOverview';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { BudgetProgress } from '@/components/dashboard/BudgetProgress';
import { CreditCardsWidget } from '@/components/dashboard/CreditCardsWidget';
import { ExpenseChart } from '@/components/dashboard/ExpenseChart';
import { MonthlyChart } from '@/components/dashboard/MonthlyChart';
import { DebtsWidget } from '@/components/dashboard/DebtsWidget';
import { DebtorsWidget } from '@/components/dashboard/DebtorsWidget';
import { CashFlowWidget } from '@/components/dashboard/CashFlowWidget';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
} from 'lucide-react';
import { getMonthSummary, getTotalBalance } from '@/data/mockData';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const Index = () => {
  const summary = getMonthSummary();
  const totalBalance = getTotalBalance();

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="mb-6 opacity-0 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Olá, João! 👋
        </h1>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">
          Aqui está o resumo das suas finanças em Janeiro 2025
        </p>
      </div>

      {/* Stats Grid - 2x2 on mobile, 4 cols on desktop */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          title="Receitas"
          value={formatCurrency(summary.income)}
          icon={TrendingUp}
          variant="income"
          trend={{ value: 12.5, isPositive: true }}
          delay={100}
        />
        <StatCard
          title="Despesas"
          value={formatCurrency(summary.expenses)}
          icon={TrendingDown}
          variant="expense"
          trend={{ value: 8.2, isPositive: false }}
          delay={150}
        />
        <StatCard
          title="Saldo"
          value={formatCurrency(summary.balance)}
          subtitle={`${summary.savingsRate.toFixed(0)}% economia`}
          icon={Wallet}
          variant="balance"
          delay={200}
        />
        <StatCard
          title="Patrimônio"
          value={formatCurrency(totalBalance)}
          icon={PiggyBank}
          variant="default"
          trend={{ value: 5.3, isPositive: true }}
          delay={250}
        />
      </div>

      {/* Main Content - Stack on mobile */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-4 sm:space-y-6 lg:col-span-2">
          <MonthlyChart />
          <RecentTransactions />
        </div>

        {/* Right Column */}
        <div className="space-y-4 sm:space-y-6">
          <CashFlowWidget />
          <DebtorsWidget />
          <AccountsOverview />
          <DebtsWidget />
          <ExpenseChart />
          <BudgetProgress />
          <CreditCardsWidget />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
