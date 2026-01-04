import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  ArrowLeftRight,
  Users,
  CreditCard,
  MoreHorizontal,
  Plus,
} from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Início' },
  { path: '/transactions', icon: ArrowLeftRight, label: 'Transações' },
  { path: '/debtors', icon: Users, label: 'Devedores' },
  { path: '/cards', icon: CreditCard, label: 'Cartões' },
];

interface MobileNavProps {
  onNewTransaction?: () => void;
}

export function MobileNav({ onNewTransaction }: MobileNavProps) {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.slice(0, 2).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-[64px]",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* FAB Central */}
        <button
          onClick={onNewTransaction}
          className="flex items-center justify-center w-14 h-14 -mt-6 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 active:scale-95 transition-transform"
        >
          <Plus className="h-6 w-6" />
        </button>

        {navItems.slice(2).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-[64px]",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
