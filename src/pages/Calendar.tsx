import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { transactions, categories, accounts } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getTransactionsForDate = (date: Date) => {
    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      return (
        tDate.getDate() === date.getDate() &&
        tDate.getMonth() === date.getMonth() &&
        tDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const selectedTransactions = selectedDate ? getTransactionsForDate(selectedDate) : [];

  // Get all days with transactions for the current month
  const datesWithTransactions = transactions
    .filter((t) => {
      const tDate = new Date(t.date);
      return (
        tDate.getMonth() === currentMonth.getMonth() &&
        tDate.getFullYear() === currentMonth.getFullYear()
      );
    })
    .map((t) => new Date(t.date).toDateString());

  const uniqueDates = [...new Set(datesWithTransactions)];

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agenda Financeira</h1>
            <p className="text-muted-foreground">
              Visualize suas transações no calendário
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Transação
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          {/* Calendar */}
          <Card className="p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold">
                  {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <Button variant="outline" size="icon" onClick={goToNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" onClick={goToToday}>
                Hoje
              </Button>
            </div>

            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="w-full"
              classNames={{
                months: 'w-full',
                month: 'w-full',
                table: 'w-full',
                head_row: 'flex w-full',
                head_cell: 'text-muted-foreground rounded-md w-full font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: 'h-14 w-full text-center text-sm p-0 relative',
                day: 'h-14 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-lg transition-colors',
                day_selected: 'bg-primary text-primary-foreground hover:bg-primary',
                day_today: 'bg-accent text-accent-foreground',
              }}
              modifiers={{
                hasTransactions: (date) => uniqueDates.includes(date.toDateString()),
              }}
              modifiersClassNames={{
                hasTransactions: 'after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-primary',
              }}
            />

            {/* Legend */}
            <div className="mt-6 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span>Dia selecionado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <span>Com transações</span>
              </div>
            </div>
          </Card>

          {/* Selected Day Transactions */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                {selectedDate?.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedTransactions.length} transação(ões)
              </p>
            </div>

            {selectedTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Nenhuma transação neste dia
                </p>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedTransactions.map((transaction) => {
                  const category = categories.find((c) => c.id === transaction.categoryId);
                  const account = accounts.find((a) => a.id === transaction.accountId);
                  const isIncome = transaction.type === 'income';

                  return (
                    <div
                      key={transaction.id}
                      className="p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg"
                            style={{ backgroundColor: `${category?.color}20` }}
                          >
                            {isIncome ? (
                              <ArrowUpRight className="h-5 w-5 text-emerald-600" />
                            ) : (
                              <ArrowDownRight className="h-5 w-5 text-rose-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {category?.name} • {account?.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={cn(
                              'font-semibold',
                              isIncome ? 'text-emerald-600' : 'text-rose-600'
                            )}
                          >
                            {isIncome ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </p>
                          {!transaction.isPaid && (
                            <Badge variant="outline" className="text-xs">
                              Pendente
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
