import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { AccountsOverview } from '@/components/dashboard/AccountsOverview';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { BudgetProgress } from '@/components/dashboard/BudgetProgress';
import { CreditCardsWidget } from '@/components/dashboard/CreditCardsWidget';
import { ExpenseChart } from '@/components/dashboard/ExpenseChart';
import { MonthlyChart } from '@/components/dashboard/MonthlyChart';
import { NewTransactionModal } from '@/components/modals/NewTransactionModal';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Plus,
} from 'lucide-react';
import { getMonthSummary, getTotalBalance } from '@/data/mockData';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const Index = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);

  const summary = getMonthSummary();
  const totalBalance = getTotalBalance();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPath={currentPath} onNavigate={setCurrentPath} />

      <div className="flex flex-1 flex-col">
        <Header onNewTransaction={() => setIsNewTransactionOpen(true)} />

        <main className="flex-1 overflow-auto">
          <div className="container max-w-7xl py-6">
            {/* Page Header */}
            <div className="mb-8 opacity-0 animate-fade-in">
              <h1 className="text-3xl font-bold tracking-tight">
                Olá, João! 👋
              </h1>
              <p className="mt-1 text-muted-foreground">
                Aqui está o resumo das suas finanças em Dezembro 2024
              </p>
            </div>

            {/* Stats Grid */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Receitas do Mês"
                value={formatCurrency(summary.income)}
                icon={TrendingUp}
                variant="income"
                trend={{ value: 12.5, isPositive: true }}
                delay={100}
              />
              <StatCard
                title="Despesas do Mês"
                value={formatCurrency(summary.expenses)}
                icon={TrendingDown}
                variant="expense"
                trend={{ value: 8.2, isPositive: false }}
                delay={150}
              />
              <StatCard
                title="Saldo do Mês"
                value={formatCurrency(summary.balance)}
                subtitle={`Taxa de economia: ${summary.savingsRate.toFixed(0)}%`}
                icon={Wallet}
                variant="balance"
                delay={200}
              />
              <StatCard
                title="Patrimônio Total"
                value={formatCurrency(totalBalance)}
                icon={PiggyBank}
                variant="default"
                trend={{ value: 5.3, isPositive: true }}
                delay={250}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Column */}
              <div className="space-y-6 lg:col-span-2">
                <MonthlyChart />
                <RecentTransactions />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <AccountsOverview />
                <ExpenseChart />
                <BudgetProgress />
                <CreditCardsWidget />
              </div>
            </div>
          </div>
        </main>

        {/* Floating Action Button (Mobile) */}
        <Button
          className="floating-action sm:hidden"
          onClick={() => setIsNewTransactionOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <NewTransactionModal
        isOpen={isNewTransactionOpen}
        onClose={() => setIsNewTransactionOpen(false)}
      />
    </div>
  );
};

export default Index;
