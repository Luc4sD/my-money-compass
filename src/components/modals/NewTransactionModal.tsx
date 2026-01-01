import { useState, useMemo } from 'react';
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
import { accounts, categories, creditCards } from '@/data/mockData';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  CalendarIcon,
  Repeat,
  Tag,
  Paperclip,
  CreditCard,
  SplitSquareHorizontal,
} from 'lucide-react';
import { TransactionType } from '@/types/finance';
import { toast } from 'sonner';
import { createInstallments, formatInstallmentValue, INSTALLMENT_OPTIONS } from '@/lib/installments';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewTransactionModal({ isOpen, onClose }: NewTransactionModalProps) {
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [isPaid, setIsPaid] = useState(true);
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  
  // Estados para parcelamento
  const [isInstallment, setIsInstallment] = useState(false);
  const [installments, setInstallments] = useState<number>(1);

  // Verifica se a conta selecionada é um cartão de crédito
  const selectedAccount = useMemo(() => {
    return accounts.find(acc => acc.id === selectedAccountId);
  }, [selectedAccountId]);

  const isCreditCardAccount = selectedAccount?.type === 'credit_card';
  
  // Busca o cartão de crédito vinculado à conta
  const linkedCreditCard = useMemo(() => {
    if (!selectedAccountId) return null;
    return creditCards.find(card => card.accountId === selectedAccountId);
  }, [selectedAccountId]);

  // Mostra opção de parcelamento apenas para despesas em cartão de crédito
  const showInstallmentOption = transactionType === 'expense' && (isCreditCardAccount || linkedCreditCard);

  const filteredCategories = categories.filter(
    (cat) => cat.type === transactionType || transactionType === 'transfer'
  );

  // Calcula o valor da parcela para exibição
  const installmentPreview = useMemo(() => {
    if (!amount || !isInstallment || installments <= 1) return null;
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return null;
    return formatInstallmentValue(numAmount, installments);
  }, [amount, isInstallment, installments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Por favor, insira um valor válido');
      return;
    }

    if (isInstallment && installments > 1) {
      // Gera transações parceladas
      const installmentTransactions = createInstallments({
        amount: numAmount,
        description,
        accountId: selectedAccountId,
        categoryId: selectedCategoryId,
        date: new Date(date),
        totalInstallments: installments,
        notes,
        tags: [],
        creditCardId: linkedCreditCard?.id,
      });

      console.log('Transações parceladas geradas:', installmentTransactions);
      toast.success(`Compra parcelada em ${installments}x criada com sucesso!`, {
        description: `${installments} parcelas de ${installmentPreview}`,
      });
    } else {
      toast.success('Transação criada com sucesso!');
    }
    
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTransactionType('expense');
    setIsPaid(true);
    setIsRecurring(false);
    setSelectedAccountId('');
    setAmount('');
    setDescription('');
    setSelectedCategoryId('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setIsInstallment(false);
    setInstallments(1);
  };

  const handleAccountChange = (value: string) => {
    setSelectedAccountId(value);
    // Reset parcelamento quando muda a conta
    if (!creditCards.find(card => card.accountId === value)) {
      setIsInstallment(false);
      setInstallments(1);
    }
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
                onClick={() => {
                  setTransactionType(type);
                  if (type !== 'expense') {
                    setIsInstallment(false);
                    setInstallments(1);
                  }
                }}
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
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            {/* Preview do parcelamento */}
            {installmentPreview && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <SplitSquareHorizontal className="h-4 w-4" />
                {installments}x de {installmentPreview}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Supermercado, Aluguel..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Account & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Conta</Label>
              <Select value={selectedAccountId} onValueChange={handleAccountChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center gap-2">
                        {creditCards.find(c => c.accountId === account.id) && (
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                        )}
                        {account.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId} required>
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

          {/* Installment Section - Só aparece para cartão de crédito + despesa */}
          {showInstallmentOption && (
            <div className="space-y-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg',
                      isInstallment ? 'bg-violet-500/20' : 'bg-secondary'
                    )}
                  >
                    <SplitSquareHorizontal
                      className={cn(
                        'h-4 w-4',
                        isInstallment ? 'text-violet-500' : 'text-muted-foreground'
                      )}
                    />
                  </div>
                  <div>
                    <p className="font-medium">É parcelado?</p>
                    <p className="text-xs text-muted-foreground">
                      Divide em várias faturas do cartão
                    </p>
                  </div>
                </div>
                <Switch checked={isInstallment} onCheckedChange={setIsInstallment} />
              </div>

              {isInstallment && (
                <div className="space-y-2 pt-2">
                  <Label>Número de parcelas</Label>
                  <Select 
                    value={installments.toString()} 
                    onValueChange={(v) => setInstallments(parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INSTALLMENT_OPTIONS.filter(opt => opt.value > 1).map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                          {amount && parseFloat(amount) > 0 && (
                            <span className="ml-2 text-muted-foreground">
                              ({formatInstallmentValue(parseFloat(amount), option.value)}/mês)
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {linkedCreditCard && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/50">
                  <CreditCard className="h-3 w-3" />
                  <span>
                    {linkedCreditCard.name} •••• {linkedCreditCard.lastFourDigits}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                className="pl-10"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Toggles - Esconde recorrência se for parcelado */}
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

            {!isInstallment && (
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
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Adicione detalhes sobre esta transação..."
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              {isInstallment && installments > 1 
                ? `Salvar ${installments} parcelas` 
                : 'Salvar'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
