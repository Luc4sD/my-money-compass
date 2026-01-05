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
        'stat-card opacity-0 animate-slide-up p-4 sm:p-6',
        variantStyles[variant],
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
          <p 
            className={cn(
              'text-lg sm:text-2xl font-bold tracking-tight transition-all duration-300 truncate',
              isPrivacyMode && 'blur-md select-none'
            )}
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            'flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl shrink-0',
            iconStyles[variant]
          )}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 sm:mt-4 flex items-center gap-1.5">
          {trend.isPositive ? (
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
          ) : (
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-rose-500" />
          )}
          <span
            className={cn(
              'text-xs sm:text-sm font-medium',
              trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            )}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">vs mês anterior</span>
        </div>
      )}
    </div>
  );
}
