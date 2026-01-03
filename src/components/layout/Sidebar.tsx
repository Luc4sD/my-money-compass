import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  ArrowLeftRight,
  PieChart,
  Target,
  Calendar,
  Settings,
  HelpCircle,
  TrendingUp,
  Tags,
  FolderTree,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Wallet, label: 'Contas', href: '/accounts' },
  { icon: CreditCard, label: 'Cartões', href: '/cards' },
  { icon: ArrowLeftRight, label: 'Transações', href: '/transactions' },
  { icon: Target, label: 'Orçamentos', href: '/budgets', badge: 2 },
  { icon: Calendar, label: 'Agenda', href: '/calendar' },
];

const financeNavItems: NavItem[] = [
  { icon: Users, label: 'Devedores', href: '/debtors' },
  { icon: TrendingUp, label: 'Fluxo de Caixa', href: '/cashflow' },
];

const analysisNavItems: NavItem[] = [
  { icon: PieChart, label: 'Relatórios', href: '/reports' },
];

const configNavItems: NavItem[] = [
  { icon: FolderTree, label: 'Categorias', href: '/categories' },
  { icon: Tags, label: 'Tags', href: '/tags' },
  { icon: Settings, label: 'Configurações', href: '/settings' },
];

interface SidebarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export function Sidebar({ currentPath = '/', onNavigate }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const NavSection = ({ items, title }: { items: NavItem[]; title?: string }) => (
    <div className="space-y-1">
      {title && !isCollapsed && (
        <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.href;
        return (
          <button
            key={item.href}
            onClick={() => onNavigate?.(item.href)}
            className={cn(
              'nav-item w-full',
              isActive && 'nav-item-active',
              isCollapsed && 'justify-center px-3'
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-medium text-primary">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
        isCollapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">FinanceHub</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(isCollapsed && 'mx-auto')}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto p-3">
        <NavSection items={mainNavItems} />
        <NavSection items={financeNavItems} title="Finanças" />
        <NavSection items={analysisNavItems} title="Análises" />
        <NavSection items={configNavItems} title="Configurações" />
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <button
          className={cn(
            'nav-item w-full',
            isCollapsed && 'justify-center px-3'
          )}
        >
          <HelpCircle className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Ajuda</span>}
        </button>
      </div>
    </aside>
  );
}
