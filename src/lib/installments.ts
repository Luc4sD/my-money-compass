import { Transaction } from '@/types/finance';
import { addMonths } from 'date-fns';

export interface InstallmentFormData {
  amount: number;
  description: string;
  accountId: string;
  categoryId: string;
  subcategoryId?: string;
  date: Date;
  totalInstallments: number;
  notes?: string;
  tags: string[];
  creditCardId?: string;
}

/**
 * Gera um array de transações parceladas
 * @param formData - Dados do formulário
 * @returns Array de transações para serem salvas
 */
export function createInstallments(formData: InstallmentFormData): Omit<Transaction, 'id' | 'createdAt'>[] {
  const {
    amount,
    description,
    accountId,
    categoryId,
    subcategoryId,
    date,
    totalInstallments,
    notes,
    tags,
    creditCardId,
  } = formData;

  const installmentAmount = Number((amount / totalInstallments).toFixed(2));
  const parentTransactionId = `parent-${Date.now()}`;
  const transactions: Omit<Transaction, 'id' | 'createdAt'>[] = [];

  // Ajuste para garantir que a soma das parcelas seja exata
  let remainingAmount = amount;

  for (let i = 0; i < totalInstallments; i++) {
    const isLastInstallment = i === totalInstallments - 1;
    const currentAmount = isLastInstallment 
      ? Number(remainingAmount.toFixed(2)) 
      : installmentAmount;
    
    remainingAmount -= installmentAmount;

    const installmentDate = addMonths(new Date(date), i);

    transactions.push({
      accountId,
      type: 'expense',
      amount: currentAmount,
      description: `${description} (${i + 1}/${totalInstallments})`,
      categoryId,
      subcategoryId,
      date: installmentDate,
      isPaid: i === 0, // Apenas a primeira parcela é marcada como paga se for hoje
      isRecurring: false,
      invoiceId: creditCardId, // Vincula ao cartão de crédito
      installmentInfo: {
        currentInstallment: i + 1,
        totalInstallments,
        parentTransactionId,
      },
      tags,
      notes: i === 0 ? notes : undefined,
    });
  }

  return transactions;
}

/**
 * Formata valor de parcela para exibição
 */
export function formatInstallmentValue(totalAmount: number, installments: number): string {
  const value = totalAmount / installments;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Opções padrão de parcelamento no Brasil
 */
export const INSTALLMENT_OPTIONS = [
  { value: 1, label: 'À vista' },
  { value: 2, label: '2x' },
  { value: 3, label: '3x' },
  { value: 4, label: '4x' },
  { value: 5, label: '5x' },
  { value: 6, label: '6x' },
  { value: 7, label: '7x' },
  { value: 8, label: '8x' },
  { value: 9, label: '9x' },
  { value: 10, label: '10x' },
  { value: 11, label: '11x' },
  { value: 12, label: '12x' },
] as const;
