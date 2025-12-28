import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { transactions, categories } from '@/data/mockData';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export function ExpenseChart() {
  // Calculate expenses by category
  const expensesByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const category = categories.find((c) => c.id === t.categoryId);
      if (category) {
        if (!acc[category.id]) {
          acc[category.id] = {
            name: category.name,
            value: 0,
            color: category.color,
          };
        }
        acc[category.id].value += t.amount;
      }
      return acc;
    }, {} as Record<string, { name: string; value: number; color: string }>);

  const chartData = Object.values(expensesByCategory).sort(
    (a, b) => b.value - a.value
  );

  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalExpenses) * 100).toFixed(1);
      return (
        <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.value)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6 opacity-0 animate-slide-up stagger-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Despesas por Categoria</h3>
          <p className="text-sm text-muted-foreground">Dezembro 2024</p>
        </div>
        <Button variant="ghost" size="icon-sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-6">
        {/* Chart */}
        <div className="relative h-[180px] w-[180px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {chartData.slice(0, 5).map((item) => {
            const percentage = ((item.value / totalExpenses) * 100).toFixed(0);
            return (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="flex-1 text-sm truncate">{item.name}</span>
                <span className="text-sm font-medium tabular-nums">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
