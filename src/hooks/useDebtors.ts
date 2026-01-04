import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Debtor {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  total_amount: number;
  is_installment: boolean;
  total_installments: number;
  installment_amount: number | null;
  start_date: string;
  due_day: number;
  status: 'active' | 'paid' | 'cancelled';
  created_at: string;
  updated_at: string;
  // Computed fields
  paid_amount?: number;
  remaining_amount?: number;
  progress_percentage?: number;
  payments?: DebtorPayment[];
}

export interface DebtorPayment {
  id: string;
  debtor_id: string;
  amount: number;
  payment_date: string;
  installment_number: number | null;
  notes: string | null;
  created_at: string;
}

export interface CreateDebtorInput {
  name: string;
  description?: string;
  total_amount: number;
  is_installment?: boolean;
  total_installments?: number;
  installment_amount?: number;
  start_date?: string;
  due_day?: number;
}

export interface CreatePaymentInput {
  debtor_id: string;
  amount: number;
  payment_date?: string;
  installment_number?: number;
  notes?: string;
}

export function useDebtors() {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDebtors = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch debtors
      const { data: debtorsData, error: debtorsError } = await supabase
        .from('debtors')
        .select('*')
        .order('created_at', { ascending: false });

      if (debtorsError) throw debtorsError;

      // Fetch all payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('debtor_payments')
        .select('*')
        .order('payment_date', { ascending: false });

      if (paymentsError) throw paymentsError;

      // Calculate computed fields for each debtor
      const enrichedDebtors = (debtorsData || []).map((debtor) => {
        const payments = (paymentsData || []).filter(p => p.debtor_id === debtor.id);
        const paidAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const remainingAmount = Number(debtor.total_amount) - paidAmount;
        const progressPercentage = (paidAmount / Number(debtor.total_amount)) * 100;

        return {
          ...debtor,
          total_amount: Number(debtor.total_amount),
          installment_amount: debtor.installment_amount ? Number(debtor.installment_amount) : null,
          paid_amount: paidAmount,
          remaining_amount: Math.max(0, remainingAmount),
          progress_percentage: Math.min(100, progressPercentage),
          payments: payments.map(p => ({ ...p, amount: Number(p.amount) })),
        } as Debtor;
      });

      setDebtors(enrichedDebtors);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar devedores';
      setError(message);
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const createDebtor = async (input: CreateDebtorInput) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('debtors')
        .insert({
          user_id: user.id,
          name: input.name,
          description: input.description || null,
          total_amount: input.total_amount,
          is_installment: input.is_installment || false,
          total_installments: input.total_installments || 1,
          installment_amount: input.installment_amount || null,
          start_date: input.start_date || new Date().toISOString().split('T')[0],
          due_day: input.due_day || 10,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: `Devedor "${input.name}" adicionado com sucesso!`,
      });

      await fetchDebtors();
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao criar devedor';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const registerPayment = async (input: CreatePaymentInput) => {
    try {
      const { data, error } = await supabase
        .from('debtor_payments')
        .insert({
          debtor_id: input.debtor_id,
          amount: input.amount,
          payment_date: input.payment_date || new Date().toISOString().split('T')[0],
          installment_number: input.installment_number || null,
          notes: input.notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Check if debtor is now fully paid
      const debtor = debtors.find(d => d.id === input.debtor_id);
      if (debtor) {
        const newPaidAmount = (debtor.paid_amount || 0) + input.amount;
        if (newPaidAmount >= debtor.total_amount) {
          return { payment: data, isFullyPaid: true };
        }
      }

      toast({
        title: 'Pagamento registrado',
        description: `R$ ${input.amount.toFixed(2)} registrado com sucesso!`,
      });

      await fetchDebtors();
      return { payment: data, isFullyPaid: false };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao registrar pagamento';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const markAsPaid = async (debtorId: string) => {
    try {
      const { error } = await supabase
        .from('debtors')
        .update({ status: 'paid' })
        .eq('id', debtorId);

      if (error) throw error;

      toast({
        title: 'Quitado!',
        description: 'Devedor marcado como quitado.',
      });

      await fetchDebtors();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao marcar como quitado';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteDebtor = async (debtorId: string) => {
    try {
      const { error } = await supabase
        .from('debtors')
        .delete()
        .eq('id', debtorId);

      if (error) throw error;

      toast({
        title: 'Removido',
        description: 'Devedor removido com sucesso.',
      });

      await fetchDebtors();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao remover devedor';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Get totals
  const getTotals = () => {
    const activeDebtors = debtors.filter(d => d.status === 'active');
    const totalRemaining = activeDebtors.reduce((sum, d) => sum + (d.remaining_amount || 0), 0);
    const totalReceived = activeDebtors.reduce((sum, d) => sum + (d.paid_amount || 0), 0);
    const totalOriginal = activeDebtors.reduce((sum, d) => sum + d.total_amount, 0);
    const overallProgress = totalOriginal > 0 ? (totalReceived / totalOriginal) * 100 : 0;

    return {
      count: activeDebtors.length,
      totalRemaining,
      totalReceived,
      totalOriginal,
      overallProgress,
    };
  };

  // Get this month's expected payments
  const getMonthlyExpected = () => {
    const activeDebtors = debtors.filter(d => d.status === 'active' && d.is_installment);
    return activeDebtors.reduce((sum, d) => sum + (d.installment_amount || 0), 0);
  };

  useEffect(() => {
    fetchDebtors();
  }, [fetchDebtors]);

  return {
    debtors,
    isLoading,
    error,
    fetchDebtors,
    createDebtor,
    registerPayment,
    markAsPaid,
    deleteDebtor,
    getTotals,
    getMonthlyExpected,
  };
}
