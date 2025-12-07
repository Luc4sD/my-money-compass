import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockMonthlyData = [
  { month: 'Jul', income: 12000, expense: 8500 },
  { month: 'Ago', income: 12500, expense: 9200 },
  { month: 'Set', income: 11800, expense: 7800 },
  { month: 'Out', income: 13200, expense: 8900 },
  { month: 'Nov', income: 12000, expense: 9500 },
  { month: 'Dez', income: 15500, expense: 7416 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover px-4 py-3 shadow-lg">
        <p className="mb-2 font-medium">{label}</p>
        {payload.map((entry: any) => (
          <p
            key={entry.name}
            className="flex items-center gap-2 text-sm"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">
              {entry.name === 'income' ? 'Receitas' : 'Despesas'}:
            </span>
            <span className="font-medium">
              {formatCurrency(entry.value)}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function MonthlyChart() {
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6 opacity-0 animate-slide-up stagger-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Evolução Mensal</h3>
          <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
        </div>
        <Button variant="ghost" size="icon-sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mockMonthlyData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => formatCurrency(value)}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingBottom: 20 }}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">
                  {value === 'income' ? 'Receitas' : 'Despesas'}
                </span>
              )}
            />
            <Bar
              dataKey="income"
              fill="hsl(var(--chart-income))"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="expense"
              fill="hsl(var(--chart-expense))"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
