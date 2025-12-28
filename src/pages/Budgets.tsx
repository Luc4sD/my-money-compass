import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { budgets, categories } from '@/data/mockData';
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
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function Budgets() {
  const [isNewBudgetOpen, setIsNewBudgetOpen] = useState(false);

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overBudgetCount = budgets.filter((b) => b.spent > b.amount).length;

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orçamentos</h1>
            <p className="text-muted-foreground">
              Defina limites de gastos para cada categoria
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
