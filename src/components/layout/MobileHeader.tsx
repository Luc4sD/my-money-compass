import { Bell, Eye, EyeOff, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePrivacy } from '@/contexts/PrivacyContext';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  ArrowLeftRight,
  Target,
  Calendar,
  Users,
  TrendingUp,
  PieChart,
  FolderTree,
  Tags,
  Settings,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Wallet, label: 'Contas', href: '/accounts' },
  { icon: CreditCard, label: 'Cartões', href: '/cards' },
  { icon: ArrowLeftRight, label: 'Transações', href: '/transactions' },
  { icon: Target, label: 'Orçamentos', href: '/budgets' },
  { icon: Calendar, label: 'Agenda', href: '/calendar' },
  { icon: Users, label: 'Devedores', href: '/debtors' },
  { icon: TrendingUp, label: 'Fluxo de Caixa', href: '/cashflow' },
  { icon: PieChart, label: 'Relatórios', href: '/reports' },
  { icon: FolderTree, label: 'Categorias', href: '/categories' },
  { icon: Tags, label: 'Tags', href: '/tags' },
  { icon: Settings, label: 'Configurações', href: '/settings' },
];

export function MobileHeader() {
  const { isPrivacyMode, togglePrivacyMode } = usePrivacy();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-xl safe-area-top">
      {/* Menu Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b border-border p-4">
            <SheetTitle className="flex items-center gap-2 text-left">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">FinanceHub</span>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 p-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground transition-colors',
                    isActive && 'bg-primary/10 text-primary font-medium'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <TrendingUp className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-base font-bold">FinanceHub</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePrivacyMode}
          className={cn(
            'h-10 w-10 rounded-xl transition-colors',
            isPrivacyMode && 'bg-violet-500/20 text-violet-500'
          )}
        >
          {isPrivacyMode ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </Button>

        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <Avatar className="h-8 w-8">
          <AvatarImage src="/avatar.jpg" alt="Avatar" />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            JD
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
