import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  ArrowLeftRight,
  Users,
  PieChart,
  Plus,
} from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Início' },
  { path: '/transactions', icon: ArrowLeftRight, label: 'Transações' },
  { path: '/debtors', icon: Users, label: 'Devedores' },
  { path: '/reports', icon: PieChart, label: 'Relatórios' },
];

interface MobileNavProps {
  onNewTransaction?: () => void;
}

export function MobileNav({ onNewTransaction }: MobileNavProps) {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.slice(0, 2).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-full transition-colors touch-manipulation",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              <item.icon className={cn("h-6 w-6", isActive && "stroke-[2.5px]")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* FAB Central */}
        <div className="relative flex items-center justify-center min-w-[56px]">
          <button
            onClick={onNewTransaction}
            className="absolute -top-5 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 active:scale-95 transition-transform touch-manipulation"
          >
            <Plus className="h-7 w-7" />
          </button>
        </div>

        {navItems.slice(2).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-full transition-colors touch-manipulation",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              <item.icon className={cn("h-6 w-6", isActive && "stroke-[2.5px]")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
