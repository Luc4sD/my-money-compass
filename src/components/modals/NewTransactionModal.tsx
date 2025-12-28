import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { accounts, categories } from '@/data/mockData';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  CalendarIcon,
  Repeat,
  Tag,
  Paperclip,
} from 'lucide-react';
import { TransactionType } from '@/types/finance';
import { toast } from 'sonner';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewTransactionModal({ isOpen, onClose }: NewTransactionModalProps) {
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [isPaid, setIsPaid] = useState(true);
  const [isRecurring, setIsRecurring] = useState(false);

  const filteredCategories = categories.filter(
    (cat) => cat.type === transactionType || transactionType === 'transfer'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Transação criada com sucesso!');
    onClose();
  };

  const typeButtons = [
    {
      type: 'expense' as TransactionType,
      label: 'Despesa',
      icon: ArrowDownCircle,
      activeClass: 'bg-rose-500 text-white border-rose-500',
    },
    {
      type: 'income' as TransactionType,
      label: 'Receita',
      icon: ArrowUpCircle,
      activeClass: 'bg-emerald-500 text-white border-emerald-500',
    },
    {
      type: 'transfer' as TransactionType,
      label: 'Transferência',
      icon: ArrowLeftRight,
      activeClass: 'bg-primary text-primary-foreground border-primary',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Nova Transação
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type Selector */}
          <div className="grid grid-cols-3 gap-2">
            {typeButtons.map(({ type, label, icon: Icon, activeClass }) => (
              <button
                key={type}
                type="button"
                onClick={() => setTransactionType(type)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border-2 border-border p-4 transition-all',
                  transactionType === type ? activeClass : 'hover:border-border/80 hover:bg-accent'
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                R$
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                className="h-14 pl-12 text-2xl font-semibold"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Supermercado, Aluguel..."
              required
            />
          </div>

          {/* Account & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Conta</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                className="pl-10"
                defaultValue={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4 rounded-xl bg-secondary/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg',
                    isPaid ? 'bg-emerald-500/20' : 'bg-secondary'
                  )}
                >
                  <ArrowDownCircle
                    className={cn(
                      'h-4 w-4',
                      isPaid ? 'text-emerald-500' : 'text-muted-foreground'
                    )}
                  />
                </div>
                <div>
                  <p className="font-medium">Já foi pago?</p>
                  <p className="text-xs text-muted-foreground">
                    Marque se a transação já foi efetivada
                  </p>
                </div>
              </div>
              <Switch checked={isPaid} onCheckedChange={setIsPaid} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg',
                    isRecurring ? 'bg-primary/20' : 'bg-secondary'
                  )}
                >
                  <Repeat
                    className={cn(
                      'h-4 w-4',
                      isRecurring ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                </div>
                <div>
                  <p className="font-medium">Transação recorrente</p>
                  <p className="text-xs text-muted-foreground">
                    Repete automaticamente todo mês
                  </p>
                </div>
              </div>
              <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Adicione detalhes sobre esta transação..."
              rows={2}
            />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" className="gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </Button>
            <Button type="button" variant="outline" size="sm" className="gap-2">
              <Paperclip className="h-4 w-4" />
              Anexar
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant={transactionType === 'income' ? 'income' : transactionType === 'expense' ? 'expense' : 'default'}
              className="flex-1"
            >
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
