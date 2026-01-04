import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, DollarSign, Calendar, FileText } from 'lucide-react';
import { Debtor, CreatePaymentInput } from '@/hooks/useDebtors';

interface RegisterPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  debtor: Debtor | null;
  onSubmit: (data: CreatePaymentInput) => Promise<{ isFullyPaid: boolean }>;
  onMarkAsPaid: (debtorId: string) => Promise<void>;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export function RegisterPaymentDialog({ 
  isOpen, 
  onClose, 
  debtor, 
  onSubmit,
  onMarkAsPaid 
}: RegisterPaymentDialogProps) {
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmPaid, setShowConfirmPaid] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!debtor) return;
    
    setIsLoading(true);

    try {
      const result = await onSubmit({
        debtor_id: debtor.id,
        amount: parseFloat(amount),
        payment_date: paymentDate,
        notes: notes || undefined,
      });

      if (result.isFullyPaid) {
        setShowConfirmPaid(true);
      } else {
        resetAndClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPaid = async () => {
    if (!debtor) return;
    await onMarkAsPaid(debtor.id);
    setShowConfirmPaid(false);
    resetAndClose();
  };

  const resetAndClose = () => {
    setAmount('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    onClose();
  };

  if (!debtor) return null;

  const suggestedAmount = debtor.is_installment && debtor.installment_amount 
    ? debtor.installment_amount 
    : debtor.remaining_amount;

  return (
    <>
      <Dialog open={isOpen && !showConfirmPaid} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
            <DialogDescription>
              Registre um pagamento de <strong>{debtor.name}</strong>
            </DialogDescription>
          </DialogHeader>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4">
            <div>
              <p className="text-xs text-muted-foreground">Valor Total</p>
              <p className="font-semibold">{formatCurrency(debtor.total_amount)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Falta Receber</p>
              <p className="font-semibold text-primary">
                {formatCurrency(debtor.remaining_amount || 0)}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Valor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount">Valor Recebido *</Label>
                {suggestedAmount && suggestedAmount > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto py-1 text-xs"
                    onClick={() => setAmount(suggestedAmount.toFixed(2))}
                  >
                    Usar {formatCurrency(suggestedAmount)}
                  </Button>
                )}
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  max={debtor.remaining_amount}
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="pl-10 h-14 text-xl font-semibold"
                  autoFocus
                />
              </div>
            </div>

            {/* Data */}
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Data do Pagamento</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="paymentDate"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="notes"
                  placeholder="Ex: Pix recebido, Parcela 5/10..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="pl-10 min-h-[80px] resize-none"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || !amount}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Registrar Pagamento
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Fully Paid Dialog */}
      <AlertDialog open={showConfirmPaid} onOpenChange={setShowConfirmPaid}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>🎉 Dívida Quitada!</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{debtor.name}</strong> pagou todo o valor devido. 
              Deseja marcar como <strong>Quitado</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={resetAndClose}>
              Não, manter ativo
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPaid}>
              Sim, marcar como Quitado
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
