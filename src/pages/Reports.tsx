import { AppLayout } from '@/components/layout/AppLayout';
import { getMonthSummary, getMonthlyEvolution, getCategoryExpenses } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Download, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function Reports() {
  const summary = getMonthSummary();
  const monthlyData = getMonthlyEvolution();
  const categoryData = getCategoryExpenses();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Relatórios</h1>
            <p className="text-muted-foreground">Análise detalhada das suas finanças</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="december">
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="december">Dezembro 2024</SelectItem>
                <SelectItem value="november">Novembro 2024</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Exportar</Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-emerald-600" /></div><div><p className="text-sm text-muted-foreground">Receitas</p><p className="text-xl font-bold text-emerald-600">{formatCurrency(summary.income)}</p></div></div></Card>
          <Card className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-rose-500/10 flex items-center justify-center"><TrendingDown className="h-5 w-5 text-rose-600" /></div><div><p className="text-sm text-muted-foreground">Despesas</p><p className="text-xl font-bold text-rose-600">{formatCurrency(summary.expenses)}</p></div></div></Card>
          <Card className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Wallet className="h-5 w-5 text-primary" /></div><div><p className="text-sm text-muted-foreground">Economia</p><p className="text-xl font-bold">{summary.savingsRate.toFixed(0)}%</p></div></div></Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Evolução Mensal</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Legend />
                  <Bar dataKey="income" name="Receitas" fill="hsl(158, 64%, 52%)" radius={[4,4,0,0]} />
                  <Bar dataKey="expenses" name="Despesas" fill="hsl(0, 84%, 60%)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Despesas por Categoria</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percentage }) => `${name}: ${percentage.toFixed(0)}%`}>
                    {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
