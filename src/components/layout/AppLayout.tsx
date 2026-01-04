import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { NewTransactionModal } from '@/components/modals/NewTransactionModal';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar currentPath={location.pathname} onNavigate={navigate} />
      )}

      <div className="flex flex-1 flex-col">
        <Header onNewTransaction={() => setIsNewTransactionOpen(true)} />

        <main className="flex-1 overflow-auto">
          <div className="container max-w-7xl py-6 px-4 sm:px-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNav onNewTransaction={() => setIsNewTransactionOpen(true)} />
      )}

      <NewTransactionModal
        isOpen={isNewTransactionOpen}
        onClose={() => setIsNewTransactionOpen(false)}
      />
    </div>
  );
}
