import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { usePrivacy } from '@/contexts/PrivacyContext';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'income' | 'expense' | 'balance' | 'default';
  className?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
  delay = 0,
}: StatCardProps) {
  const { isPrivacyMode } = usePrivacy();

  const variantStyles = {
    income: 'stat-card-income',
    expense: 'stat-card-expense',
    balance: 'stat-card-balance',
    default: 'bg-card border border-border',
  };

  const iconStyles = {
    income: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    expense: 'bg-rose-500/20 text-rose-600 dark:text-rose-400',
    balance: 'bg-primary/20 text-primary',
    default: 'bg-secondary text-secondary-foreground',
  };

  return (
    <div
      className={cn(
        'stat-card opacity-0 animate-slide-up',
        variantStyles[variant],
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p 
            className={cn(
              'text-2xl font-bold tracking-tight transition-all duration-300',
              isPrivacyMode && 'blur-md select-none'
            )}
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            iconStyles[variant]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1.5">
          {trend.isPositive ? (
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-rose-500" />
          )}
          <span
            className={cn(
              'text-sm font-medium',
              trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            )}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-sm text-muted-foreground">vs mês anterior</span>
        </div>
      )}
    </div>
  );
}
