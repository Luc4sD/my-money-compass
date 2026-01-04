import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, User, FileText, DollarSign, Calendar, Hash } from 'lucide-react';
import { CreateDebtorInput } from '@/hooks/useDebtors';

interface NewDebtorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDebtorInput) => Promise<void>;
}

export function NewDebtorDialog({ isOpen, onClose, onSubmit }: NewDebtorDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [isInstallment, setIsInstallment] = useState(false);
  const [totalInstallments, setTotalInstallments] = useState('');
  const [dueDay, setDueDay] = useState('10');
  const [isLoading, setIsLoading] = useState(false);

  const calculatedInstallment = isInstallment && totalAmount && totalInstallments
    ? parseFloat(totalAmount) / parseInt(totalInstallments)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit({
        name,
        description: description || undefined,
        total_amount: parseFloat(totalAmount),
        is_installment: isInstallment,
        total_installments: isInstallment ? parseInt(totalInstallments) : 1,
        installment_amount: isInstallment ? calculatedInstallment : undefined,
        due_day: parseInt(dueDay) || 10,
      });

      // Reset form
      setName('');
      setDescription('');
      setTotalAmount('');
      setIsInstallment(false);
      setTotalInstallments('');
      setDueDay('10');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Devedor</DialogTitle>
          <DialogDescription>
            Cadastre uma pessoa que te deve dinheiro
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Ex: Rafael, Vilma..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="description"
                placeholder="Ex: iPhone 15, Empréstimo..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Valor Total */}
          <div className="space-y-2">
            <Label htmlFor="totalAmount">Valor Total *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="totalAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>

          {/* Switch Parcelado */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isInstallment">É parcelado?</Label>
              <p className="text-sm text-muted-foreground">
                A pessoa vai pagar em parcelas mensais
              </p>
            </div>
            <Switch
              id="isInstallment"
              checked={isInstallment}
              onCheckedChange={setIsInstallment}
            />
          </div>

          {/* Campos de Parcelamento */}
          {isInstallment && (
            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="totalInstallments">Qtd. Parcelas</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="totalInstallments"
                    type="number"
                    min="1"
                    placeholder="10"
                    value={totalInstallments}
                    onChange={(e) => setTotalInstallments(e.target.value)}
                    required={isInstallment}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDay">Dia Vencimento</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dueDay"
                    type="number"
                    min="1"
                    max="31"
                    placeholder="10"
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Valor Calculado da Parcela */}
          {isInstallment && calculatedInstallment > 0 && (
            <div className="rounded-lg bg-primary/10 p-4 text-center">
              <p className="text-sm text-muted-foreground">Valor de cada parcela:</p>
              <p className="text-2xl font-bold text-primary">
                R$ {calculatedInstallment.toFixed(2)}
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Adicionar Devedor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
