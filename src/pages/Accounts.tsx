import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { accounts } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  PiggyBank,
  Wallet,
  Utensils,
  TrendingUp,
  Plus,
  MoreHorizontal,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Building2,
  PiggyBank,
  Wallet,
  Utensils,
  TrendingUp,
};

const accountTypeLabels: Record<string, string> = {
  checking: 'Conta Corrente',
  savings: 'Poupança',
  wallet: 'Carteira',
  meal_voucher: 'Vale Refeição',
  investment: 'Investimentos',
  credit_card: 'Cartão de Crédito',
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function Accounts() {
  const [showBalances, setShowBalances] = useState(true);
  const [isNewAccountOpen, setIsNewAccountOpen] = useState(false);

  const totalBalance = accounts
    .filter((a) => a.type !== 'credit_card')
    .reduce((sum, a) => sum + a.balance, 0);

  const accountsByType = accounts.reduce((acc, account) => {
    if (!acc[account.type]) acc[account.type] = [];
    acc[account.type].push(account);
    return acc;
  }, {} as Record<string, typeof accounts>);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contas</h1>
            <p className="text-muted-foreground">
              Gerencie suas contas bancárias e carteiras
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowBalances(!showBalances)}
            >
              {showBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Dialog open={isNewAccountOpen} onOpenChange={setIsNewAccountOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Conta
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Conta</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Nome da Conta</Label>
                    <Input placeholder="Ex: Nubank, Itaú..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(accountTypeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Saldo Inicial</Label>
                    <Input type="number" placeholder="0,00" />
                  </div>
                  <Button className="w-full" onClick={() => setIsNewAccountOpen(false)}>
                    Criar Conta
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Total Balance Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Patrimônio Total</p>
              <p className="text-4xl font-bold tracking-tight mt-1">
                {showBalances ? formatCurrency(totalBalance) : '••••••••'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1 text-emerald-600">
                <ArrowUpRight className="h-4 w-4" />
                +5.3%
              </span>
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          </div>
        </Card>

        {/* Accounts by Type */}
        {Object.entries(accountsByType).map(([type, typeAccounts]) => (
          <div key={type} className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {accountTypeLabels[type] || type}
              <Badge variant="secondary">{typeAccounts.length}</Badge>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {typeAccounts.map((account) => {
                const Icon = iconMap[account.icon] || Building2;
                return (
                  <Card
                    key={account.id}
                    className="p-4 hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-xl"
                          style={{ backgroundColor: `${account.color}20` }}
                        >
                          <Icon className="h-6 w-6" style={{ color: account.color }} />
                        </div>
                        <div>
                          <p className="font-semibold">{account.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {accountTypeLabels[account.type]}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">Saldo atual</p>
                      <p
                        className={cn(
                          'text-2xl font-bold tabular-nums',
                          account.balance < 0 && 'text-destructive'
                        )}
                      >
                        {showBalances ? formatCurrency(account.balance) : '••••••'}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
