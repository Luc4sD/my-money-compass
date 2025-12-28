import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { NewTransactionModal } from '@/components/modals/NewTransactionModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPath={location.pathname} onNavigate={navigate} />

      <div className="flex flex-1 flex-col">
        <Header onNewTransaction={() => setIsNewTransactionOpen(true)} />

        <main className="flex-1 overflow-auto">
          <div className="container max-w-7xl py-6">
            {children}
          </div>
        </main>

        <Button
          className="floating-action sm:hidden"
          onClick={() => setIsNewTransactionOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <NewTransactionModal
        isOpen={isNewTransactionOpen}
        onClose={() => setIsNewTransactionOpen(false)}
      />
    </div>
  );
}
