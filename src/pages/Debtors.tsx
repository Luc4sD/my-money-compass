import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { usePrivacy } from '@/contexts/PrivacyContext';
import {
  debtors,
  getDebtorPayments,
  getTotalDebtors,
  getAllDebtorPayments,
} from '@/data/mockData';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

export default function Debtors() {
  const { isPrivacyMode } = usePrivacy();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDebtor, setExpandedDebtor] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  
  const totals = getTotalDebtors();
  const allPayments = getAllDebtorPayments();
  
  const filteredDebtors = debtors
    .filter(d => d.isActive)
    .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const toggleExpanded = (id: string) => {
    setExpandedDebtor(expandedDebtor === id ? null : id);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
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
            >
              <History className="mr-2 h-4 w-4" />
              Timeline
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Devedor
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Devedores Ativos</p>
                <p className="text-2xl font-bold">{totals.count}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total a Receber</p>
                <p className={cn("text-2xl font-bold", isPrivacyMode && "blur-md")}>
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
                <p className="text-sm text-muted-foreground">Já Recebido</p>
                <p className={cn("text-2xl font-bold", isPrivacyMode && "blur-md")}>
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
                <p className="text-sm text-muted-foreground">Progresso Geral</p>
                <div className="flex items-center gap-2">
                  <Progress value={totals.percentageReceived} className="h-2 flex-1" />
                  <span className="text-sm font-medium">{totals.percentageReceived.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Lista de Devedores */}
          <div className={cn("space-y-4", showTimeline ? "lg:col-span-2" : "lg:col-span-3")}>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar devedor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Debtors List */}
            <div className="space-y-3">
              {filteredDebtors.map((debtor) => {
                const payments = getDebtorPayments(debtor.id);
                const remaining = debtor.totalAmount - debtor.paidAmount;
                const progress = (debtor.paidAmount / debtor.totalAmount) * 100;
                const isExpanded = expandedDebtor === debtor.id;
                const installmentValue = debtor.installments 
                  ? debtor.totalAmount / debtor.installments 
                  : remaining;

                return (
                  <Card key={debtor.id} className="overflow-hidden">
                    {/* Main Card Content */}
                    <div
                      className="cursor-pointer p-4 transition-colors hover:bg-muted/50"
                      onClick={() => toggleExpanded(debtor.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{debtor.name}</h3>
                            {debtor.phone && (
                              <a
                                href={`tel:${debtor.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-muted-foreground hover:text-primary"
                              >
                                <Phone className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                          {debtor.description && (
                            <p className="text-sm text-muted-foreground">{debtor.description}</p>
                          )}
                          
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {debtor.installments && (
                              <Badge variant="outline">
                                {debtor.paidInstallments}/{debtor.installments} parcelas
                              </Badge>
                            )}
                            {debtor.dueDate && (
                              <Badge variant="secondary" className="gap-1">
                                <Calendar className="h-3 w-3" />
                                Até {formatDate(debtor.dueDate)}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={cn("text-lg font-bold text-emerald-600", isPrivacyMode && "blur-md")}>
                            {formatCurrency(remaining)}
                          </p>
                          <p className="text-xs text-muted-foreground">a receber</p>
                          {debtor.installments && (
                            <p className={cn("mt-1 text-sm text-muted-foreground", isPrivacyMode && "blur-md")}>
                              {formatCurrency(installmentValue)}/mês
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4 flex items-center gap-3">
                        <Progress value={progress} className="h-2 flex-1" />
                        <span className="text-sm font-medium text-muted-foreground">
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
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-medium">Histórico de Pagamentos</h4>
                          <Button size="sm" variant="outline">
                            <Plus className="mr-1 h-3 w-3" />
                            Registrar Pagamento
                          </Button>
                        </div>
                        
                        {payments.length > 0 ? (
                          <div className="space-y-2">
                            {payments.map((payment) => (
                              <div
                                key={payment.id}
                                className="flex items-center justify-between rounded-lg bg-background p-3"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">{formatDate(payment.date)}</p>
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
                              {formatCurrency(debtor.totalAmount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Total Recebido</p>
                            <p className={cn("font-semibold text-emerald-600", isPrivacyMode && "blur-md")}>
                              {formatCurrency(debtor.paidAmount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Timeline Geral */}
          {showTimeline && (
            <Card className="p-4 lg:col-span-1">
              <h3 className="mb-4 font-semibold flex items-center gap-2">
                <History className="h-4 w-4" />
                Timeline de Recebimentos
              </h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {allPayments.slice(0, 20).map((payment) => {
                  const debtor = debtors.find(d => d.id === payment.debtorId);
                  return (
                    <div key={payment.id} className="flex gap-3 border-l-2 border-emerald-500/30 pl-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{debtor?.name}</p>
                          <p className={cn("text-sm font-semibold text-emerald-600", isPrivacyMode && "blur-md")}>
                            +{formatCurrency(payment.amount)}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(payment.date)}
                          {payment.notes && ` • ${payment.notes}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}