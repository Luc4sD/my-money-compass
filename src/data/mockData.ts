import { Account, Category, Transaction, CreditCard, Budget, Tag } from '@/types/finance';

export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Nubank',
    type: 'checking',
    balance: 12450.80,
    currency: 'BRL',
    color: '#8A05BE',
    icon: 'building-2',
    isActive: true,
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: 'Itaú',
    type: 'checking',
    balance: 8320.50,
    currency: 'BRL',
    color: '#FF6B00',
    icon: 'building-2',
    isActive: true,
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '3',
    name: 'Poupança Itaú',
    type: 'savings',
    balance: 45000.00,
    currency: 'BRL',
    color: '#00A651',
    icon: 'piggy-bank',
    isActive: true,
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '4',
    name: 'Carteira',
    type: 'wallet',
    balance: 350.00,
    currency: 'BRL',
    color: '#4A90A4',
    icon: 'wallet',
    isActive: true,
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '5',
    name: 'Vale Refeição',
    type: 'meal_voucher',
    balance: 890.00,
    currency: 'BRL',
    color: '#E74C3C',
    icon: 'utensils',
    isActive: true,
    createdAt: new Date('2023-01-01'),
  },
];

export const mockCreditCards: CreditCard[] = [
  {
    id: '1',
    accountId: '1',
    name: 'Nubank Platinum',
    lastFourDigits: '4532',
    limit: 15000,
    availableLimit: 8750,
    closingDay: 3,
    dueDay: 10,
    brand: 'mastercard',
    color: '#8A05BE',
  },
  {
    id: '2',
    accountId: '2',
    name: 'Itaú Personnalité',
    lastFourDigits: '7821',
    limit: 25000,
    availableLimit: 18200,
    closingDay: 15,
    dueDay: 22,
    brand: 'visa',
    color: '#FF6B00',
  },
];

export const mockCategories: Category[] = [
  { id: '1', name: 'Moradia', type: 'expense', icon: 'home', color: '#3B82F6', subcategories: [
    { id: '1-1', name: 'Aluguel', type: 'expense', icon: 'key', color: '#3B82F6', parentId: '1' },
    { id: '1-2', name: 'Condomínio', type: 'expense', icon: 'building', color: '#3B82F6', parentId: '1' },
    { id: '1-3', name: 'Luz', type: 'expense', icon: 'zap', color: '#3B82F6', parentId: '1' },
  ]},
  { id: '2', name: 'Alimentação', type: 'expense', icon: 'utensils', color: '#EF4444', subcategories: [
    { id: '2-1', name: 'Supermercado', type: 'expense', icon: 'shopping-cart', color: '#EF4444', parentId: '2' },
    { id: '2-2', name: 'Restaurante', type: 'expense', icon: 'utensils', color: '#EF4444', parentId: '2' },
    { id: '2-3', name: 'Delivery', type: 'expense', icon: 'bike', color: '#EF4444', parentId: '2' },
  ]},
  { id: '3', name: 'Transporte', type: 'expense', icon: 'car', color: '#F59E0B', subcategories: [
    { id: '3-1', name: 'Combustível', type: 'expense', icon: 'fuel', color: '#F59E0B', parentId: '3' },
    { id: '3-2', name: 'Uber/99', type: 'expense', icon: 'smartphone', color: '#F59E0B', parentId: '3' },
    { id: '3-3', name: 'Transporte Público', type: 'expense', icon: 'bus', color: '#F59E0B', parentId: '3' },
  ]},
  { id: '4', name: 'Lazer', type: 'expense', icon: 'gamepad-2', color: '#8B5CF6', subcategories: [
    { id: '4-1', name: 'Streaming', type: 'expense', icon: 'tv', color: '#8B5CF6', parentId: '4' },
    { id: '4-2', name: 'Cinema', type: 'expense', icon: 'film', color: '#8B5CF6', parentId: '4' },
    { id: '4-3', name: 'Games', type: 'expense', icon: 'gamepad-2', color: '#8B5CF6', parentId: '4' },
  ]},
  { id: '5', name: 'Saúde', type: 'expense', icon: 'heart-pulse', color: '#EC4899' },
  { id: '6', name: 'Educação', type: 'expense', icon: 'graduation-cap', color: '#06B6D4' },
  { id: '7', name: 'Salário', type: 'income', icon: 'banknote', color: '#10B981' },
  { id: '8', name: 'Freelance', type: 'income', icon: 'laptop', color: '#14B8A6' },
  { id: '9', name: 'Investimentos', type: 'income', icon: 'trending-up', color: '#6366F1' },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    accountId: '1',
    type: 'expense',
    amount: 2500,
    description: 'Aluguel Dezembro',
    categoryId: '1',
    subcategoryId: '1-1',
    date: new Date('2024-12-05'),
    isPaid: true,
    isRecurring: true,
    tags: ['fixo'],
    createdAt: new Date('2024-12-01'),
  },
  {
    id: '2',
    accountId: '1',
    type: 'income',
    amount: 12000,
    description: 'Salário Dezembro',
    categoryId: '7',
    date: new Date('2024-12-05'),
    isPaid: true,
    isRecurring: true,
    tags: [],
    createdAt: new Date('2024-12-05'),
  },
  {
    id: '3',
    accountId: '4',
    type: 'expense',
    amount: 156.80,
    description: 'Supermercado Extra',
    categoryId: '2',
    subcategoryId: '2-1',
    date: new Date('2024-12-06'),
    isPaid: true,
    isRecurring: false,
    tags: [],
    createdAt: new Date('2024-12-06'),
  },
  {
    id: '4',
    accountId: '1',
    type: 'expense',
    amount: 89.90,
    description: 'Netflix + Spotify',
    categoryId: '4',
    subcategoryId: '4-1',
    date: new Date('2024-12-07'),
    isPaid: true,
    isRecurring: true,
    tags: ['assinatura'],
    createdAt: new Date('2024-12-07'),
  },
  {
    id: '5',
    accountId: '2',
    type: 'expense',
    amount: 4500,
    description: 'iPhone 15 Pro (1/12)',
    categoryId: '4',
    date: new Date('2024-12-04'),
    isPaid: true,
    isRecurring: false,
    invoiceId: 'inv-1',
    installmentInfo: {
      currentInstallment: 1,
      totalInstallments: 12,
      parentTransactionId: 'parent-1',
    },
    tags: [],
    createdAt: new Date('2024-12-04'),
  },
  {
    id: '6',
    accountId: '1',
    type: 'expense',
    amount: 45.00,
    description: 'Uber - Aeroporto',
    categoryId: '3',
    subcategoryId: '3-2',
    date: new Date('2024-12-06'),
    isPaid: true,
    isRecurring: false,
    tags: ['viagem'],
    createdAt: new Date('2024-12-06'),
  },
  {
    id: '7',
    accountId: '5',
    type: 'expense',
    amount: 78.50,
    description: 'Restaurante Outback',
    categoryId: '2',
    subcategoryId: '2-2',
    date: new Date('2024-12-05'),
    isPaid: true,
    isRecurring: false,
    tags: [],
    createdAt: new Date('2024-12-05'),
  },
  {
    id: '8',
    accountId: '1',
    type: 'income',
    amount: 3500,
    description: 'Freelance - Projeto XYZ',
    categoryId: '8',
    date: new Date('2024-12-03'),
    isPaid: true,
    isRecurring: false,
    tags: ['extra'],
    createdAt: new Date('2024-12-03'),
  },
];

export const mockBudgets: Budget[] = [
  { id: '1', categoryId: '2', amount: 1500, spent: 1234.30, period: 'monthly', alertThresholds: [50, 80, 100] },
  { id: '2', categoryId: '3', amount: 800, spent: 445.00, period: 'monthly', alertThresholds: [50, 80, 100] },
  { id: '3', categoryId: '4', amount: 500, spent: 389.90, period: 'monthly', alertThresholds: [50, 80, 100] },
  { id: '4', categoryId: '5', amount: 400, spent: 180.00, period: 'monthly', alertThresholds: [50, 80, 100] },
];

export const mockTags: Tag[] = [
  { id: '1', name: 'fixo', color: '#3B82F6' },
  { id: '2', name: 'assinatura', color: '#8B5CF6' },
  { id: '3', name: 'viagem', color: '#F59E0B' },
  { id: '4', name: 'extra', color: '#10B981' },
  { id: '5', name: 'férias2025', color: '#EC4899' },
];

export const getMonthSummary = () => {
  const income = mockTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    income,
    expenses,
    balance: income - expenses,
    savingsRate: ((income - expenses) / income) * 100,
  };
};

export const getTotalBalance = () => {
  return mockAccounts
    .filter(a => a.type !== 'credit_card')
    .reduce((sum, a) => sum + a.balance, 0);
};
