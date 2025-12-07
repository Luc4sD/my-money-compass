import { mockCreditCards } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { CreditCard, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const brandLogos: Record<string, string> = {
  visa: 'VISA',
  mastercard: 'MC',
  amex: 'AMEX',
  elo: 'ELO',
  other: '••••',
};

export function CreditCardsWidget() {
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6 opacity-0 animate-slide-up stagger-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Cartões de Crédito</h3>
          <p className="text-sm text-muted-foreground">Faturas abertas</p>
        </div>
        <Button variant="ghost" size="icon-sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {mockCreditCards.map((card) => {
          const usedPercentage =
            ((card.limit - card.availableLimit) / card.limit) * 100;
          const usedAmount = card.limit - card.availableLimit;

          return (
            <div
              key={card.id}
              className="group cursor-pointer rounded-xl border border-border/50 p-4 transition-all hover:border-border hover:shadow-md"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${card.color}20` }}
                  >
                    <CreditCard
                      className="h-5 w-5"
                      style={{ color: card.color }}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{card.name}</p>
                    <p className="text-xs text-muted-foreground">
                      •••• {card.lastFourDigits}
                    </p>
                  </div>
                </div>
                <span
                  className="rounded-md px-2 py-1 text-xs font-bold"
                  style={{
                    backgroundColor: `${card.color}20`,
                    color: card.color,
                  }}
                >
                  {brandLogos[card.brand]}
                </span>
              </div>

              {/* Usage Bar */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fatura atual</span>
                  <span className="font-semibold">{formatCurrency(usedAmount)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      usedPercentage > 80
                        ? 'bg-destructive'
                        : usedPercentage > 50
                        ? 'bg-warning'
                        : 'bg-primary'
                    )}
                    style={{ width: `${usedPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Limite disponível</span>
                  <span>{formatCurrency(card.availableLimit)}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
                <div className="text-xs text-muted-foreground">
                  <span>Fecha dia {card.closingDay}</span>
                  <span className="mx-2">•</span>
                  <span>Vence dia {card.dueDay}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>

      <Button variant="ghost" className="w-full gap-2">
        Ver detalhes das faturas
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
