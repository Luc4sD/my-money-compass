import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { creditCards, invoices } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CreditCard,
  Plus,
  MoreHorizontal,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};

const brandLogos: Record<string, string> = {
  visa: 'VISA',
  mastercard: 'MC',
  amex: 'AMEX',
  elo: 'ELO',
};

const statusConfig = {
  open: { label: 'Aberta', color: 'bg-blue-500', icon: Clock },
  closed: { label: 'Fechada', color: 'bg-yellow-500', icon: AlertCircle },
  paid: { label: 'Paga', color: 'bg-green-500', icon: CheckCircle2 },
  overdue: { label: 'Atrasada', color: 'bg-red-500', icon: AlertCircle },
};

export default function Cards() {
  const [selectedCard, setSelectedCard] = useState(creditCards[0]?.id);

  const totalLimit = creditCards.reduce((sum, c) => sum + c.limit, 0);
  const totalUsed = creditCards.reduce((sum, c) => sum + (c.limit - c.availableLimit), 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cartões de Crédito</h1>
            <p className="text-muted-foreground">
              Gerencie seus cartões e faturas
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Cartão
          </Button>
        </div>

        {/* Overview Card */}
        <Card className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Limite Total</p>
              <p className="text-2xl font-bold">{formatCurrency(totalLimit)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Limite Utilizado</p>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(totalUsed)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Limite Disponível</p>
              <p className="text-2xl font-bold text-emerald-600">
                {formatCurrency(totalLimit - totalUsed)}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={(totalUsed / totalLimit) * 100} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {((totalUsed / totalLimit) * 100).toFixed(0)}% do limite utilizado
            </p>
          </div>
        </Card>

        {/* Cards Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Cards List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Seus Cartões</h2>
            <div className="space-y-3">
              {creditCards.map((card) => {
                const usedAmount = card.limit - card.availableLimit;
                const usedPercentage = (usedAmount / card.limit) * 100;
                const isSelected = selectedCard === card.id;

                return (
                  <Card
                    key={card.id}
                    className={cn(
                      'p-4 cursor-pointer transition-all hover:shadow-md',
                      isSelected && 'ring-2 ring-primary'
                    )}
                    onClick={() => setSelectedCard(card.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-14 w-20 items-center justify-center rounded-lg relative overflow-hidden"
                        style={{ backgroundColor: card.color }}
                      >
                        <CreditCard className="h-6 w-6 text-white" />
                        <span className="absolute bottom-1 right-2 text-[8px] text-white/80 font-bold">
                          {brandLogos[card.brand]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{card.name}</p>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          •••• {card.lastFourDigits}
                        </p>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Fatura atual</span>
                            <span className="font-medium">{formatCurrency(usedAmount)}</span>
                          </div>
                          <Progress
                            value={usedPercentage}
                            className={cn(
                              'h-1.5',
                              usedPercentage > 80 && '[&>div]:bg-destructive',
                              usedPercentage > 50 && usedPercentage <= 80 && '[&>div]:bg-warning'
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t flex justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Fecha dia {card.closingDay}
                      </span>
                      <span>Vence dia {card.dueDay}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Invoices */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Faturas</h2>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="open">Abertas</TabsTrigger>
                <TabsTrigger value="closed">Fechadas</TabsTrigger>
                <TabsTrigger value="paid">Pagas</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-3 mt-4">
                {invoices
                  .filter((inv) => !selectedCard || inv.creditCardId === selectedCard)
                  .map((invoice) => {
                    const card = creditCards.find((c) => c.id === invoice.creditCardId);
                    const config = statusConfig[invoice.status];
                    const StatusIcon = config.icon;

                    return (
                      <Card key={invoice.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded-lg"
                              style={{ backgroundColor: `${card?.color}20` }}
                            >
                              <CreditCard className="h-5 w-5" style={{ color: card?.color }} />
                            </div>
                            <div>
                              <p className="font-medium">{card?.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {invoice.referenceMonth}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(invoice.totalAmount)}</p>
                            <Badge
                              variant="secondary"
                              className={cn('gap-1', config.color, 'text-white')}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {config.label}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t flex justify-between text-sm text-muted-foreground">
                          <span>Fechamento: {formatDate(invoice.closingDate)}</span>
                          <span>Vencimento: {formatDate(invoice.dueDate)}</span>
                        </div>
                      </Card>
                    );
                  })}
              </TabsContent>
              <TabsContent value="open">
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma fatura aberta
                </p>
              </TabsContent>
              <TabsContent value="closed">
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma fatura fechada
                </p>
              </TabsContent>
              <TabsContent value="paid">
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma fatura paga
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
