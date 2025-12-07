// Core types for the financial management system

export type AccountType = 'checking' | 'savings' | 'wallet' | 'meal_voucher' | 'investment' | 'credit_card';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: Date;
}

export interface CreditCard {
  id: string;
  accountId: string;
  name: string;
  lastFourDigits: string;
  limit: number;
  availableLimit: number;
  closingDay: number;
  dueDay: number;
  brand: 'visa' | 'mastercard' | 'amex' | 'elo' | 'other';
  color: string;
}

export interface Invoice {
  id: string;
  creditCardId: string;
  referenceMonth: string; // YYYY-MM format
  closingDate: Date;
  dueDate: Date;
  totalAmount: number;
  status: 'open' | 'closed' | 'paid' | 'overdue';
}

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  description: string;
  categoryId: string;
  subcategoryId?: string;
  date: Date;
  isPaid: boolean;
  isRecurring: boolean;
  recurringRuleId?: string;
  invoiceId?: string;
  installmentInfo?: {
    currentInstallment: number;
    totalInstallments: number;
    parentTransactionId: string;
  };
  tags: string[];
  notes?: string;
  attachments?: string[];
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  parentId?: string;
  subcategories?: Category[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'yearly';
  alertThresholds: number[]; // e.g., [50, 80, 100]
}

export interface RecurringRule {
  id: string;
  transactionTemplate: Partial<Transaction>;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  dayOfMonth?: number;
  dayOfWeek?: number;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  nextOccurrence: Date;
}

// Dashboard summary types
export interface MonthSummary {
  income: number;
  expenses: number;
  balance: number;
  savingsRate: number;
  topCategories: {
    category: Category;
    amount: number;
    percentage: number;
  }[];
}

export interface CashFlowItem {
  date: Date;
  income: number;
  expense: number;
  balance: number;
  projectedBalance: number;
}
