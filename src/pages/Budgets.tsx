import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { budgets, categories, transactions } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Target,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Calculator,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function Budgets() {
  const [isNewBudgetOpen, setIsNewBudgetOpen] = useState(false);
  const [expectedIncome, setExpectedIncome] = useState<number>(0);
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState('');

  // Calculate current month transactions
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const monthTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    return tDate >= startOfMonth && tDate <= endOfMonth;
  });

  // Receitas realizadas (já recebidas)
  const realizedIncome = monthTransactions
    .filter((t) => t.type === 'income' && t.isPaid)
    .reduce((sum, t) => sum + t.amount, 0);

  // Receitas pendentes
  const pendingIncome = monthTransactions
    .filter((t) => t.type === 'income' && !t.isPaid)
    .reduce((sum, t) => sum + t.amount, 0);

  // Despesas realizadas (já pagas)
  const realizedExpenses = monthTransactions
    .filter((t) => t.type === 'expense' && t.isPaid)
    .reduce((sum, t) => sum + t.amount, 0);

  // Despesas pendentes (a pagar)
  const pendingExpenses = monthTransactions
    .filter((t) => t.type === 'expense' && !t.isPaid)
    .reduce((sum, t) => sum + t.amount, 0);

  // Total income (expected or from transactions)
  const totalIncome = expectedIncome > 0 ? expectedIncome : realizedIncome + pendingIncome;
  
  // Total expenses
  const totalExpenses = realizedExpenses + pendingExpenses;

  // Balance
  const balance = totalIncome - totalExpenses;
  const isPositive = balance >= 0;

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overBudgetCount = budgets.filter((b) => b.spent > b.amount).length;

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const handleSaveIncome = () => {
    const value = parseFloat(tempIncome.replace(',', '.'));
    if (!isNaN(value) && value >= 0) {
      setExpectedIncome(value);
      toast.success('Receita prevista atualizada!');
    }
    setIsEditingIncome(false);
  };

  const monthName = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orçamentos</h1>
            <p className="text-muted-foreground">
              Controle de receitas, despesas e limites de gastos - {monthName}
            </p>
          </div>
          <Dialog open={isNewBudgetOpen} onOpenChange={setIsNewBudgetOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Orçamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Orçamento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((category) => (
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
                <div className="space-y-2">
                  <Label>Valor Limite</Label>
                  <Input type="number" placeholder="0,00" />
                </div>
                <div className="space-y-2">
                  <Label>Período</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={() => setIsNewBudgetOpen(false)}>
                  Criar Orçamento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Monthly Balance Summary */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Balanço Mensal</h2>
                <p className="text-sm text-muted-foreground">Receitas vs Despesas</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Receitas */}
            <div className="p-4 rounded-xl bg-background/80 border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ArrowUpCircle className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Receitas Previstas
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setTempIncome(expectedIncome > 0 ? expectedIncome.toString() : (realizedIncome + pendingIncome).toString());
                    setIsEditingIncome(true);
                  }}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
              {isEditingIncome ? (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={tempIncome}
                    onChange={(e) => setTempIncome(e.target.value)}
                    placeholder="0,00"
                    className="h-8"
                    autoFocus
                  />
                  <Button size="sm" onClick={handleSaveIncome}>
                    OK
                  </Button>
                </div>
              ) : (
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(totalIncome)}
                </p>
              )}
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <p>Recebido: {formatCurrency(realizedIncome)}</p>
                <p>A receber: {formatCurrency(pendingIncome)}</p>
              </div>
            </div>

            {/* Despesas */}
            <div className="p-4 rounded-xl bg-background/80 border">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDownCircle className="h-5 w-5 text-rose-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  Despesas do Mês
                </span>
              </div>
              <p className="text-2xl font-bold text-rose-600">
                {formatCurrency(totalExpenses)}
              </p>
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <p>Pago: {formatCurrency(realizedExpenses)}</p>
                <p>A pagar: {formatCurrency(pendingExpenses)}</p>
              </div>
            </div>

            {/* Saldo */}
            <div
              className={cn(
                'p-4 rounded-xl border-2',
                isPositive
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-rose-500/10 border-rose-500/30'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-5 w-5" />
                <span className="text-sm font-medium text-muted-foreground">
                  Saldo do Mês
                </span>
              </div>
              <p
                className={cn(
                  'text-3xl font-bold',
                  isPositive ? 'text-emerald-600' : 'text-rose-600'
                )}
              >
                {isPositive ? '+' : ''}{formatCurrency(balance)}
              </p>
              <p className="mt-2 text-sm font-medium">
                {isPositive ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Você está no positivo!
                  </span>
                ) : (
                  <span className="text-rose-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Atenção: saldo negativo
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Uso da receita</span>
              <span className={cn(
                'font-medium',
                totalIncome > 0 && (totalExpenses / totalIncome) > 1 ? 'text-rose-600' : 'text-muted-foreground'
              )}>
                {totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div className="h-4 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  totalIncome > 0 && (totalExpenses / totalIncome) > 1
                    ? 'bg-rose-500'
                    : totalIncome > 0 && (totalExpenses / totalIncome) > 0.8
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                )}
                style={{
                  width: `${Math.min(totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0, 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>R$ 0</span>
              <span>{formatCurrency(totalIncome)}</span>
            </div>
          </div>
        </Card>

        {/* Overview Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Orçamento Total</p>
                <p className="text-xl font-bold">{formatCurrency(totalBudget)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10">
                <TrendingUp className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Gasto</p>
                <p className="text-xl font-bold">{formatCurrency(totalSpent)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg',
                  overBudgetCount > 0 ? 'bg-destructive/10' : 'bg-emerald-500/10'
                )}
              >
                {overBudgetCount > 0 ? (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-xl font-bold">
                  {overBudgetCount > 0
                    ? `${overBudgetCount} excedidos`
                    : 'Tudo certo!'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Budget List */}
        <div className="grid gap-4 sm:grid-cols-2">
          {budgets.map((budget) => {
            const category = categories.find((c) => c.id === budget.categoryId);
            const percentage = (budget.spent / budget.amount) * 100;
            const isOverBudget = percentage >= 100;
            const isWarning = percentage >= 80 && percentage < 100;
            const remaining = budget.amount - budget.spent;

            return (
              <Card key={budget.id} className="p-6 group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${category?.color}20` }}
                    >
                      <Target className="h-6 w-6" style={{ color: category?.color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{category?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {budget.period === 'monthly' ? 'Mensal' : 'Anual'}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="opacity-0 group-hover:opacity-100"
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

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span
                        className={cn(
                          'text-2xl font-bold',
                          isOverBudget && 'text-destructive',
                          isWarning && 'text-warning'
                        )}
                      >
                        {formatCurrency(budget.spent)}
                      </span>
                      <span className="text-muted-foreground">
                        {' '}/ {formatCurrency(budget.amount)}
                      </span>
                    </div>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isOverBudget && 'text-destructive',
                        isWarning && 'text-warning',
                        !isOverBudget && !isWarning && 'text-emerald-600'
                      )}
                    >
                      {percentage.toFixed(0)}%
                    </span>
                  </div>

                  <Progress
                    value={Math.min(percentage, 100)}
                    className={cn(
                      'h-3',
                      isOverBudget && '[&>div]:bg-destructive',
                      isWarning && '[&>div]:bg-warning'
                    )}
                  />

                  <p className="text-sm text-muted-foreground">
                    {isOverBudget ? (
                      <span className="text-destructive font-medium">
                        Excedeu {formatCurrency(Math.abs(remaining))}
                      </span>
                    ) : (
                      <>Restam {formatCurrency(remaining)}</>
                    )}
                  </p>
                </div>

                {/* Alert Thresholds */}
                {(isOverBudget || isWarning) && (
                  <div
                    className={cn(
                      'mt-4 p-3 rounded-lg flex items-center gap-2 text-sm',
                      isOverBudget ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'
                    )}
                  >
                    <AlertCircle className="h-4 w-4" />
                    {isOverBudget
                      ? 'Você ultrapassou o limite deste orçamento'
                      : 'Você já usou mais de 80% do orçamento'}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
