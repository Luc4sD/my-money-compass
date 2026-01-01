import {
  Account,
  CreditCard,
  Invoice,
  Transaction,
  Category,
  Tag,
  Budget,
  RecurringRule,
  MonthSummary,
  CashFlowItem,
  Debt,
} from '@/types/finance';

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

export const accounts: Account[] = [
  { id: 'acc-1', name: 'Nubank', type: 'checking', balance: 12450.75, currency: 'BRL', color: '#8B5CF6', icon: 'Building2', isActive: true, createdAt: new Date('2023-01-15') },
  { id: 'acc-2', name: 'Itaú', type: 'checking', balance: 8320.50, currency: 'BRL', color: '#F97316', icon: 'Building2', isActive: true, createdAt: new Date('2023-02-01') },
  { id: 'acc-3', name: 'Poupança Inter', type: 'savings', balance: 25000.00, currency: 'BRL', color: '#F59E0B', icon: 'PiggyBank', isActive: true, createdAt: new Date('2023-03-10') },
  { id: 'acc-4', name: 'Carteira', type: 'wallet', balance: 350.00, currency: 'BRL', color: '#10B981', icon: 'Wallet', isActive: true, createdAt: new Date('2023-01-01') },
  { id: 'acc-5', name: 'VR Benefícios', type: 'meal_voucher', balance: 890.00, currency: 'BRL', color: '#EC4899', icon: 'Utensils', isActive: true, createdAt: new Date('2023-04-01') },
  { id: 'acc-6', name: 'XP Investimentos', type: 'investment', balance: 45000.00, currency: 'BRL', color: '#3B82F6', icon: 'TrendingUp', isActive: true, createdAt: new Date('2023-05-15') },
];

export const creditCards: CreditCard[] = [
  { id: 'card-1', accountId: 'acc-1', name: 'Nubank Platinum', lastFourDigits: '4532', limit: 15000, availableLimit: 8750, closingDay: 15, dueDay: 22, brand: 'mastercard', color: '#8B5CF6' },
  { id: 'card-2', accountId: 'acc-2', name: 'Itaú Personnalité', lastFourDigits: '8821', limit: 25000, availableLimit: 18200, closingDay: 10, dueDay: 17, brand: 'visa', color: '#F97316' },
  { id: 'card-3', accountId: 'acc-2', name: 'Itaú Black', lastFourDigits: '1199', limit: 50000, availableLimit: 42500, closingDay: 5, dueDay: 12, brand: 'mastercard', color: '#1F2937' },
];

export const invoices: Invoice[] = [
  { id: 'inv-1', creditCardId: 'card-1', referenceMonth: '2024-12', closingDate: new Date('2024-12-15'), dueDate: new Date('2024-12-22'), totalAmount: 6250.00, status: 'open' },
  { id: 'inv-2', creditCardId: 'card-1', referenceMonth: '2024-11', closingDate: new Date('2024-11-15'), dueDate: new Date('2024-11-22'), totalAmount: 4890.50, status: 'paid' },
  { id: 'inv-3', creditCardId: 'card-2', referenceMonth: '2024-12', closingDate: new Date('2024-12-10'), dueDate: new Date('2024-12-17'), totalAmount: 6800.00, status: 'closed' },
];

export const categories: Category[] = [
  // Receitas
  { id: 'cat-income-1', name: 'Salário', type: 'income', icon: 'Briefcase', color: '#10B981' },
  { id: 'cat-income-2', name: 'Freelance', type: 'income', icon: 'Laptop', color: '#3B82F6' },
  { id: 'cat-income-3', name: 'Investimentos', type: 'income', icon: 'TrendingUp', color: '#8B5CF6' },
  { id: 'cat-income-4', name: 'Outros Rendimentos', type: 'income', icon: 'DollarSign', color: '#10B981' },
  
  // Despesas - Moradia e Contas
  { id: 'cat-3', name: 'Moradia', type: 'expense', icon: 'Home', color: '#8B5CF6', subcategories: [
    { id: 'cat-3-1', name: 'Aluguel', type: 'expense', icon: 'Home', color: '#8B5CF6' },
    { id: 'cat-3-2', name: 'Condomínio', type: 'expense', icon: 'Building', color: '#8B5CF6' },
    { id: 'cat-3-3', name: 'Energia Elétrica', type: 'expense', icon: 'Zap', color: '#8B5CF6' },
    { id: 'cat-3-4', name: 'Água', type: 'expense', icon: 'Droplets', color: '#8B5CF6' },
    { id: 'cat-3-5', name: 'Gás', type: 'expense', icon: 'Flame', color: '#8B5CF6' },
    { id: 'cat-3-6', name: 'Internet', type: 'expense', icon: 'Wifi', color: '#8B5CF6' },
    { id: 'cat-3-7', name: 'Telefone', type: 'expense', icon: 'Phone', color: '#8B5CF6' },
    { id: 'cat-3-8', name: 'IPTU', type: 'expense', icon: 'FileText', color: '#8B5CF6' },
  ]},
  
  // Despesas - Transporte
  { id: 'cat-2', name: 'Transporte', type: 'expense', icon: 'Car', color: '#3B82F6', subcategories: [
    { id: 'cat-2-1', name: 'Combustível', type: 'expense', icon: 'Fuel', color: '#3B82F6' },
    { id: 'cat-2-2', name: 'Uber/99', type: 'expense', icon: 'Car', color: '#3B82F6' },
    { id: 'cat-2-3', name: 'Estacionamento', type: 'expense', icon: 'ParkingCircle', color: '#3B82F6' },
    { id: 'cat-2-4', name: 'Manutenção Veículo', type: 'expense', icon: 'Wrench', color: '#3B82F6' },
    { id: 'cat-2-5', name: 'Seguro Veículo', type: 'expense', icon: 'Shield', color: '#3B82F6' },
    { id: 'cat-2-6', name: 'Parcela Veículo', type: 'expense', icon: 'CreditCard', color: '#3B82F6' },
    { id: 'cat-2-7', name: 'IPVA/Licenciamento', type: 'expense', icon: 'FileText', color: '#3B82F6' },
    { id: 'cat-2-8', name: 'Transporte Público', type: 'expense', icon: 'Bus', color: '#3B82F6' },
  ]},
  
  // Despesas - Alimentação
  { id: 'cat-1', name: 'Alimentação', type: 'expense', icon: 'Utensils', color: '#F97316', subcategories: [
    { id: 'cat-1-1', name: 'Restaurantes', type: 'expense', icon: 'Utensils', color: '#F97316' },
    { id: 'cat-1-2', name: 'Supermercado', type: 'expense', icon: 'ShoppingCart', color: '#F97316' },
    { id: 'cat-1-3', name: 'Delivery', type: 'expense', icon: 'Bike', color: '#F97316' },
    { id: 'cat-1-4', name: 'Padaria/Café', type: 'expense', icon: 'Coffee', color: '#F97316' },
  ]},
  
  // Despesas - Educação
  { id: 'cat-6', name: 'Educação', type: 'expense', icon: 'GraduationCap', color: '#06B6D4', subcategories: [
    { id: 'cat-6-1', name: 'Mensalidade Faculdade', type: 'expense', icon: 'GraduationCap', color: '#06B6D4' },
    { id: 'cat-6-2', name: 'Cursos', type: 'expense', icon: 'BookOpen', color: '#06B6D4' },
    { id: 'cat-6-3', name: 'Material Escolar', type: 'expense', icon: 'PenTool', color: '#06B6D4' },
    { id: 'cat-6-4', name: 'Livros', type: 'expense', icon: 'Book', color: '#06B6D4' },
  ]},
  
  // Despesas - Saúde
  { id: 'cat-5', name: 'Saúde', type: 'expense', icon: 'Heart', color: '#EF4444', subcategories: [
    { id: 'cat-5-1', name: 'Farmácia', type: 'expense', icon: 'Pill', color: '#EF4444' },
    { id: 'cat-5-2', name: 'Plano de Saúde', type: 'expense', icon: 'HeartPulse', color: '#EF4444' },
    { id: 'cat-5-3', name: 'Consultas Médicas', type: 'expense', icon: 'Stethoscope', color: '#EF4444' },
    { id: 'cat-5-4', name: 'Academia', type: 'expense', icon: 'Dumbbell', color: '#EF4444' },
    { id: 'cat-5-5', name: 'Dentista', type: 'expense', icon: 'Smile', color: '#EF4444' },
  ]},
  
  // Despesas - Lazer
  { id: 'cat-4', name: 'Lazer', type: 'expense', icon: 'Gamepad2', color: '#EC4899', subcategories: [
    { id: 'cat-4-1', name: 'Cinema/Shows', type: 'expense', icon: 'Film', color: '#EC4899' },
    { id: 'cat-4-2', name: 'Streaming', type: 'expense', icon: 'Tv', color: '#EC4899' },
    { id: 'cat-4-3', name: 'Viagens', type: 'expense', icon: 'Plane', color: '#EC4899' },
    { id: 'cat-4-4', name: 'Hobbies', type: 'expense', icon: 'Palette', color: '#EC4899' },
  ]},
  
  // Despesas - Compras
  { id: 'cat-7', name: 'Compras', type: 'expense', icon: 'ShoppingBag', color: '#F59E0B', subcategories: [
    { id: 'cat-7-1', name: 'Roupas', type: 'expense', icon: 'Shirt', color: '#F59E0B' },
    { id: 'cat-7-2', name: 'Eletrônicos', type: 'expense', icon: 'Smartphone', color: '#F59E0B' },
    { id: 'cat-7-3', name: 'Casa/Decoração', type: 'expense', icon: 'Sofa', color: '#F59E0B' },
  ]},
  
  // Despesas - Seguros e Financeiro
  { id: 'cat-8', name: 'Seguros', type: 'expense', icon: 'Shield', color: '#6366F1', subcategories: [
    { id: 'cat-8-1', name: 'Seguro de Vida', type: 'expense', icon: 'HeartHandshake', color: '#6366F1' },
    { id: 'cat-8-2', name: 'Seguro Residencial', type: 'expense', icon: 'Home', color: '#6366F1' },
  ]},
  
  // Despesas - Transferências/Pix
  { id: 'cat-9', name: 'Transferências', type: 'expense', icon: 'Send', color: '#14B8A6', subcategories: [
    { id: 'cat-9-1', name: 'Pix para Terceiros', type: 'expense', icon: 'Send', color: '#14B8A6' },
    { id: 'cat-9-2', name: 'Empréstimos a Terceiros', type: 'expense', icon: 'HandCoins', color: '#14B8A6' },
    { id: 'cat-9-3', name: 'Presentes', type: 'expense', icon: 'Gift', color: '#14B8A6' },
  ]},
  
  // Despesas - Serviços e Assinaturas
  { id: 'cat-11', name: 'Assinaturas', type: 'expense', icon: 'CreditCard', color: '#A855F7', subcategories: [
    { id: 'cat-11-1', name: 'Spotify/Música', type: 'expense', icon: 'Music', color: '#A855F7' },
    { id: 'cat-11-2', name: 'Apps/Software', type: 'expense', icon: 'AppWindow', color: '#A855F7' },
    { id: 'cat-11-3', name: 'Jornais/Revistas', type: 'expense', icon: 'Newspaper', color: '#A855F7' },
  ]},
  
  // Outros
  { id: 'cat-10', name: 'Outros', type: 'expense', icon: 'MoreHorizontal', color: '#6B7280' },
];

export const tags: Tag[] = [
  { id: 'tag-1', name: 'Férias 2024', color: '#F97316' },
  { id: 'tag-2', name: 'Trabalho', color: '#3B82F6' },
  { id: 'tag-3', name: 'Pessoal', color: '#EC4899' },
  { id: 'tag-4', name: 'Emergência', color: '#EF4444' },
  { id: 'tag-5', name: 'Investimento', color: '#10B981' },
];

export const transactions: Transaction[] = [
  { id: 'tr-1', accountId: 'acc-1', type: 'expense', amount: 89.90, description: 'iFood - Jantar', categoryId: 'cat-1', subcategoryId: 'cat-1-3', date: daysAgo(0), isPaid: true, isRecurring: false, tags: [], createdAt: daysAgo(0) },
  { id: 'tr-2', accountId: 'acc-4', type: 'expense', amount: 15.50, description: 'Café da manhã', categoryId: 'cat-1', date: daysAgo(0), isPaid: true, isRecurring: false, tags: ['tag-2'], createdAt: daysAgo(0) },
  { id: 'tr-3', accountId: 'acc-1', type: 'expense', amount: 250.00, description: 'Supermercado Extra', categoryId: 'cat-1', subcategoryId: 'cat-1-2', date: daysAgo(1), isPaid: true, isRecurring: false, tags: [], createdAt: daysAgo(1) },
  { id: 'tr-5', accountId: 'acc-2', type: 'income', amount: 12500.00, description: 'Salário Dezembro', categoryId: 'cat-income-1', date: daysAgo(5), isPaid: true, isRecurring: true, tags: [], createdAt: daysAgo(5) },
  { id: 'tr-6', accountId: 'acc-1', type: 'expense', amount: 2800.00, description: 'Aluguel Dezembro', categoryId: 'cat-3', subcategoryId: 'cat-3-1', date: daysAgo(5), isPaid: true, isRecurring: true, tags: [], createdAt: daysAgo(5) },
  { id: 'tr-7', accountId: 'acc-1', type: 'expense', amount: 450.00, description: 'Condomínio', categoryId: 'cat-3', subcategoryId: 'cat-3-2', date: daysAgo(5), isPaid: true, isRecurring: true, tags: [], createdAt: daysAgo(5) },
  { id: 'tr-8', accountId: 'acc-1', type: 'expense', amount: 189.90, description: 'Energia Elétrica', categoryId: 'cat-3', subcategoryId: 'cat-3-3', date: daysAgo(3), isPaid: true, isRecurring: false, tags: [], createdAt: daysAgo(3) },
  { id: 'tr-10', accountId: 'acc-2', type: 'income', amount: 3500.00, description: 'Projeto Freelance', categoryId: 'cat-income-2', date: daysAgo(10), isPaid: true, isRecurring: false, tags: ['tag-2'], createdAt: daysAgo(10) },
  { id: 'tr-11', accountId: 'acc-1', type: 'expense', amount: 55.90, description: 'Netflix', categoryId: 'cat-4', subcategoryId: 'cat-4-2', date: daysAgo(12), isPaid: true, isRecurring: true, tags: [], createdAt: daysAgo(12) },
  { id: 'tr-13', accountId: 'acc-1', type: 'expense', amount: 149.90, description: 'Academia Smart Fit', categoryId: 'cat-5', subcategoryId: 'cat-5-4', date: daysAgo(1), isPaid: true, isRecurring: true, tags: ['tag-3'], createdAt: daysAgo(1) },
  { id: 'tr-15', accountId: 'acc-2', type: 'transfer', amount: 5000.00, description: 'Transferência para Poupança', categoryId: 'cat-10', date: daysAgo(6), isPaid: true, isRecurring: false, tags: ['tag-5'], createdAt: daysAgo(6) },
  { id: 'tr-19', accountId: 'acc-1', type: 'expense', amount: 2800.00, description: 'Aluguel Janeiro', categoryId: 'cat-3', subcategoryId: 'cat-3-1', date: daysFromNow(5), isPaid: false, isRecurring: true, tags: [], createdAt: new Date() },
];

export const budgets: Budget[] = [
  { id: 'budget-1', categoryId: 'cat-1', amount: 1500, spent: 1245.30, period: 'monthly', alertThresholds: [50, 80, 100] },
  { id: 'budget-2', categoryId: 'cat-2', amount: 800, spent: 605.90, period: 'monthly', alertThresholds: [50, 80, 100] },
  { id: 'budget-3', categoryId: 'cat-3', amount: 4000, spent: 3439.90, period: 'monthly', alertThresholds: [50, 80, 100] },
  { id: 'budget-4', categoryId: 'cat-4', amount: 500, spent: 390.80, period: 'monthly', alertThresholds: [50, 80, 100] },
  { id: 'budget-5', categoryId: 'cat-5', amount: 600, spent: 239.40, period: 'monthly', alertThresholds: [50, 80, 100] },
];

export const recurringRules: RecurringRule[] = [
  { id: 'rec-1', transactionTemplate: { type: 'income', amount: 12500.00, description: 'Salário', categoryId: 'cat-income-1', accountId: 'acc-2' }, frequency: 'monthly', dayOfMonth: 5, startDate: new Date('2023-01-05'), isActive: true, nextOccurrence: daysFromNow(5) },
  { id: 'rec-2', transactionTemplate: { type: 'expense', amount: 2800.00, description: 'Aluguel', categoryId: 'cat-3', accountId: 'acc-1' }, frequency: 'monthly', dayOfMonth: 5, startDate: new Date('2023-01-05'), isActive: true, nextOccurrence: daysFromNow(5) },
];

// Dívidas e Empréstimos
export const debts: Debt[] = [
  {
    id: 'debt-1',
    name: 'Empréstimo Pai',
    type: 'personal',
    totalAmount: 5000.00,
    paidAmount: 2000.00,
    creditor: 'Pai',
    dueDate: daysFromNow(180),
    notes: 'Empréstimo para emergência médica',
    isActive: true,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(30),
  },
  {
    id: 'debt-2',
    name: 'Financiamento Carro',
    type: 'financing',
    totalAmount: 45000.00,
    paidAmount: 18000.00,
    creditor: 'Banco Itaú',
    interestRate: 1.2,
    installments: 48,
    paidInstallments: 19,
    dueDate: new Date('2026-05-15'),
    isActive: true,
    createdAt: daysAgo(580),
    updatedAt: daysAgo(5),
  },
  {
    id: 'debt-3',
    name: 'Cartão Nubank Atrasado',
    type: 'credit_card_debt',
    totalAmount: 3200.00,
    paidAmount: 800.00,
    creditor: 'Nubank',
    interestRate: 14.5,
    dueDate: daysFromNow(30),
    isActive: true,
    createdAt: daysAgo(60),
    updatedAt: daysAgo(15),
  },
];

export const getTotalBalance = (): number => accounts.filter((acc) => acc.isActive && acc.type !== 'credit_card').reduce((sum, acc) => sum + acc.balance, 0);

export const getMonthSummary = (): MonthSummary => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthTransactions = transactions.filter((t) => new Date(t.date) >= startOfMonth && t.isPaid);
  const income = monthTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = monthTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
  const categorySpending: Record<string, number> = {};
  monthTransactions.filter((t) => t.type === 'expense').forEach((t) => { categorySpending[t.categoryId] = (categorySpending[t.categoryId] || 0) + t.amount; });
  const topCategories = Object.entries(categorySpending).map(([categoryId, amount]) => {
    const category = categories.find((c) => c.id === categoryId);
    return { category: category!, amount, percentage: expenses > 0 ? (amount / expenses) * 100 : 0 };
  }).sort((a, b) => b.amount - a.amount).slice(0, 5);
  return { income, expenses, balance, savingsRate, topCategories };
};

export const getCashFlow = (days: number = 30): CashFlowItem[] => {
  const items: CashFlowItem[] = [];
  let runningBalance = getTotalBalance();
  for (let i = -days; i <= days; i++) {
    const date = new Date(); date.setDate(date.getDate() + i); date.setHours(0, 0, 0, 0);
    const dayTransactions = transactions.filter((t) => { const tDate = new Date(t.date); tDate.setHours(0, 0, 0, 0); return tDate.getTime() === date.getTime(); });
    const incomeVal = dayTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenseVal = dayTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    if (i <= 0) runningBalance = runningBalance - expenseVal + incomeVal;
    items.push({ date, income: incomeVal, expense: expenseVal, balance: runningBalance, projectedBalance: i > 0 ? runningBalance - expenseVal + incomeVal : runningBalance });
  }
  return items;
};

export const getAccountById = (id: string) => accounts.find((acc) => acc.id === id);
export const getCategoryById = (id: string): Category | undefined => {
  for (const cat of categories) { if (cat.id === id) return cat; if (cat.subcategories) { const sub = cat.subcategories.find((s) => s.id === id); if (sub) return sub; } }
  return undefined;
};
export const getTagById = (id: string) => tags.find((tag) => tag.id === id);
export const getMonthlyEvolution = () => [
  { month: 'Jul', income: 14500, expenses: 11200 }, { month: 'Ago', income: 13800, expenses: 10800 },
  { month: 'Set', income: 15200, expenses: 12100 }, { month: 'Out', income: 14000, expenses: 11500 },
  { month: 'Nov', income: 16000, expenses: 12800 }, { month: 'Dez', income: 16000, expenses: 9500 },
];
export const getCategoryExpenses = () => {
  const summary = getMonthSummary();
  return summary.topCategories.map((tc) => ({ name: tc.category.name, value: tc.amount, color: tc.category.color, percentage: tc.percentage }));
};

// Funções para Dívidas
export const getTotalDebts = () => {
  const activeDebts = debts.filter(d => d.isActive);
  const totalDebt = activeDebts.reduce((sum, d) => sum + d.totalAmount, 0);
  const totalPaid = activeDebts.reduce((sum, d) => sum + d.paidAmount, 0);
  const totalRemaining = totalDebt - totalPaid;
  const percentagePaid = totalDebt > 0 ? (totalPaid / totalDebt) * 100 : 0;
  return { totalDebt, totalPaid, totalRemaining, percentagePaid };
};

export const getDebtById = (id: string) => debts.find((d) => d.id === id);
