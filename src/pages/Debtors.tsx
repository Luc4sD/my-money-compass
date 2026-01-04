import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePrivacy } from '@/contexts/PrivacyContext';
import { useDebtors, Debtor } from '@/hooks/useDebtors';
import { NewDebtorDialog } from '@/components/debtors/NewDebtorDialog';
import { RegisterPaymentDialog } from '@/components/debtors/RegisterPaymentDialog';
import { DebtorsSkeleton } from '@/components/ui/skeleton-card';
import {
  Users,
  TrendingUp,
  Clock,
  Search,
  Phone,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Calendar,
  Plus,
  History,
  CheckCircle,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

export default function Debtors() {
  const { isPrivacyMode } = usePrivacy();
  const { 
    debtors, 
    isLoading, 
    createDebtor, 
    registerPayment, 
    markAsPaid,
    deleteDebtor,
    getTotals,
    fetchDebtors,
  } = useDebtors();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDebtor, setExpandedDebtor] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  
  // Dialogs
  const [isNewDebtorOpen, setIsNewDebtorOpen] = useState(false);
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const totals = getTotals();
  
  const filteredDebtors = debtors
    .filter(d => activeTab === 'active' ? d.status === 'active' : d.status === 'paid')
    .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Get all payments for timeline
  const allPayments = debtors
    .flatMap(d => (d.payments || []).map(p => ({ ...p, debtorName: d.name })))
    .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());

  const toggleExpanded = (id: string) => {
    setExpandedDebtor(expandedDebtor === id ? null : id);
  };

  const handleOpenPaymentDialog = (debtor: Debtor, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDebtor(debtor);
    setIsPaymentDialogOpen(true);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <DebtorsSkeleton />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 pb-24">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Devedores</h1>
            <p className="text-muted-foreground">
              CRM Financeiro - Gerencie quem te deve
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={showTimeline ? 'default' : 'outline'}
              onClick={() => setShowTimeline(!showTimeline)}
              size="sm"
            >
              <History className="mr-2 h-4 w-4" />
              Timeline
            </Button>
            <Button onClick={() => setIsNewDebtorOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Devedor
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Devedores</p>
                <p className="text-xl sm:text-2xl font-bold">{totals.count}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">A Receber</p>
                <p className={cn("text-xl sm:text-2xl font-bold", isPrivacyMode && "blur-md")}>
                  {formatCurrency(totals.totalRemaining)}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Recebido</p>
                <p className={cn("text-xl sm:text-2xl font-bold", isPrivacyMode && "blur-md")}>
                  {formatCurrency(totals.totalReceived)}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Progresso</p>
                <div className="flex items-center gap-2">
                  <Progress value={totals.overallProgress} className="h-2 w-16 sm:flex-1" />
                  <span className="text-sm font-medium">{totals.overallProgress.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Lista de Devedores */}
          <div className={cn("space-y-4", showTimeline ? "lg:col-span-2" : "lg:col-span-3")}>
            {/* Tabs e Search */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <TabsList>
                  <TabsTrigger value="active">Ativos</TabsTrigger>
                  <TabsTrigger value="paid">Quitados</TabsTrigger>
                </TabsList>
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar devedor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
              </div>

              <TabsContent value="active" className="mt-4 space-y-3">
                {filteredDebtors.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 font-semibold">Nenhum devedor ativo</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Adicione pessoas que te devem dinheiro
                    </p>
                    <Button className="mt-4" onClick={() => setIsNewDebtorOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Devedor
                    </Button>
                  </Card>
                ) : (
                  filteredDebtors.map((debtor) => (
                    <DebtorCard
                      key={debtor.id}
                      debtor={debtor}
                      isExpanded={expandedDebtor === debtor.id}
                      isPrivacyMode={isPrivacyMode}
                      onToggle={() => toggleExpanded(debtor.id)}
                      onRegisterPayment={(e) => handleOpenPaymentDialog(debtor, e)}
                      onMarkAsPaid={() => markAsPaid(debtor.id)}
                      onDelete={() => deleteDebtor(debtor.id)}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="paid" className="mt-4 space-y-3">
                {filteredDebtors.length === 0 ? (
                  <Card className="p-8 text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 font-semibold">Nenhum devedor quitado</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Devedores quitados aparecerão aqui
                    </p>
                  </Card>
                ) : (
                  filteredDebtors.map((debtor) => (
                    <DebtorCard
                      key={debtor.id}
                      debtor={debtor}
                      isExpanded={expandedDebtor === debtor.id}
                      isPrivacyMode={isPrivacyMode}
                      onToggle={() => toggleExpanded(debtor.id)}
                      onRegisterPayment={(e) => handleOpenPaymentDialog(debtor, e)}
                      onMarkAsPaid={() => markAsPaid(debtor.id)}
                      onDelete={() => deleteDebtor(debtor.id)}
                      isPaid
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Timeline Geral */}
          {showTimeline && (
            <Card className="p-4 lg:col-span-1 h-fit max-h-[600px] overflow-hidden">
              <h3 className="mb-4 font-semibold flex items-center gap-2">
                <History className="h-4 w-4" />
                Timeline de Recebimentos
              </h3>
              <div className="space-y-3 overflow-y-auto max-h-[520px] pr-2">
                {allPayments.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Nenhum pagamento registrado
                  </p>
                ) : (
                  allPayments.slice(0, 20).map((payment) => (
                    <div key={payment.id} className="flex gap-3 border-l-2 border-emerald-500/30 pl-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{payment.debtorName}</p>
                          <p className={cn("text-sm font-semibold text-emerald-600", isPrivacyMode && "blur-md")}>
                            +{formatCurrency(payment.amount)}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(payment.payment_date)}
                          {payment.notes && ` • ${payment.notes}`}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <NewDebtorDialog
        isOpen={isNewDebtorOpen}
        onClose={() => setIsNewDebtorOpen(false)}
        onSubmit={async (data) => {
          await createDebtor(data);
        }}
      />

      <RegisterPaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => {
          setIsPaymentDialogOpen(false);
          setSelectedDebtor(null);
        }}
        debtor={selectedDebtor}
        onSubmit={registerPayment}
        onMarkAsPaid={async (id) => {
          await markAsPaid(id);
          await fetchDebtors();
        }}
      />
    </AppLayout>
  );
}

// Debtor Card Component
interface DebtorCardProps {
  debtor: Debtor;
  isExpanded: boolean;
  isPrivacyMode: boolean;
  onToggle: () => void;
  onRegisterPayment: (e: React.MouseEvent) => void;
  onMarkAsPaid: () => void;
  onDelete: () => void;
  isPaid?: boolean;
}

function DebtorCard({ 
  debtor, 
  isExpanded, 
  isPrivacyMode, 
  onToggle, 
  onRegisterPayment,
  onMarkAsPaid,
  onDelete,
  isPaid 
}: DebtorCardProps) {
  const progress = debtor.progress_percentage || 0;
  const installmentValue = debtor.is_installment && debtor.installment_amount
    ? debtor.installment_amount
    : debtor.remaining_amount;

  return (
    <Card className={cn("overflow-hidden", isPaid && "opacity-75")}>
      {/* Main Card Content */}
      <div
        className="cursor-pointer p-4 transition-colors hover:bg-muted/50 active:bg-muted"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold truncate">{debtor.name}</h3>
              {isPaid && (
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Quitado
                </Badge>
              )}
            </div>
            {debtor.description && (
              <p className="text-sm text-muted-foreground truncate">{debtor.description}</p>
            )}
            
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {debtor.is_installment && debtor.total_installments > 1 && (
                <Badge variant="outline">
                  {debtor.total_installments}x de {formatCurrency(debtor.installment_amount || 0)}
                </Badge>
              )}
              <Badge variant="secondary" className="gap-1">
                <Calendar className="h-3 w-3" />
                Dia {debtor.due_day}
              </Badge>
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className={cn(
              "text-lg font-bold",
              isPaid ? "text-emerald-600" : "text-primary",
              isPrivacyMode && "blur-md"
            )}>
              {formatCurrency(debtor.remaining_amount || 0)}
            </p>
            <p className="text-xs text-muted-foreground">
              {isPaid ? "recebido" : "a receber"}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 flex items-center gap-3">
          <Progress value={progress} className="h-2 flex-1" />
          <span className="text-sm font-medium text-muted-foreground min-w-[3rem] text-right">
            {progress.toFixed(0)}%
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Expanded Payment History */}
      {isExpanded && (
        <div className="border-t bg-muted/30 p-4">
          <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
            <h4 className="font-medium">Histórico de Pagamentos</h4>
            {!isPaid && (
              <Button size="sm" onClick={onRegisterPayment} className="h-9">
                <Plus className="mr-1 h-3 w-3" />
                Registrar Pagamento
              </Button>
            )}
          </div>
          
          {debtor.payments && debtor.payments.length > 0 ? (
            <div className="space-y-2">
              {debtor.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between rounded-lg bg-background p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{formatDate(payment.payment_date)}</p>
                      {payment.notes && (
                        <p className="text-xs text-muted-foreground">{payment.notes}</p>
                      )}
                    </div>
                  </div>
                  <p className={cn("font-semibold text-emerald-600", isPrivacyMode && "blur-md")}>
                    +{formatCurrency(payment.amount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              Nenhum pagamento registrado ainda
            </p>
          )}

          {/* Summary */}
          <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Emprestado</p>
              <p className={cn("font-semibold", isPrivacyMode && "blur-md")}>
                {formatCurrency(debtor.total_amount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Recebido</p>
              <p className={cn("font-semibold text-emerald-600", isPrivacyMode && "blur-md")}>
                {formatCurrency(debtor.paid_amount || 0)}
              </p>
            </div>
          </div>

          {/* Actions */}
          {!isPaid && (
            <div className="mt-4 flex gap-2 border-t pt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsPaid();
                }}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Marcar como Quitado
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
