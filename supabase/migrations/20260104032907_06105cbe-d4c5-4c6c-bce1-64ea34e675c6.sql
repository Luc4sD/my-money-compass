-- =============================================
-- ACCOUNTS/BALANCES - Saldo guardado/reserva
-- =============================================
CREATE TABLE public.accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  balance DECIMAL(12,2) NOT NULL DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'checking', -- checking, savings, investment
  icon TEXT DEFAULT 'wallet',
  color TEXT DEFAULT '#10b981',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- DEBTORS - Quem me deve dinheiro
-- =============================================
CREATE TABLE public.debtors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  total_amount DECIMAL(12,2) NOT NULL,
  is_installment BOOLEAN NOT NULL DEFAULT false,
  total_installments INTEGER DEFAULT 1,
  installment_amount DECIMAL(12,2),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_day INTEGER DEFAULT 10,
  status TEXT NOT NULL DEFAULT 'active', -- active, paid, cancelled
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- DEBTOR_PAYMENTS - Histórico de pagamentos recebidos
-- =============================================
CREATE TABLE public.debtor_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  debtor_id UUID NOT NULL REFERENCES public.debtors(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  installment_number INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- DEBTS - Minhas dívidas (o que eu devo)
-- =============================================
CREATE TABLE public.debts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  total_amount DECIMAL(12,2) NOT NULL,
  installment_amount DECIMAL(12,2),
  total_installments INTEGER NOT NULL DEFAULT 1,
  paid_installments INTEGER NOT NULL DEFAULT 0,
  due_day INTEGER DEFAULT 10,
  category TEXT DEFAULT 'outros',
  status TEXT NOT NULL DEFAULT 'active', -- active, paid, cancelled
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- RECURRING_BILLS - Contas fixas recorrentes
-- =============================================
CREATE TABLE public.recurring_bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  due_day INTEGER NOT NULL DEFAULT 10,
  category TEXT DEFAULT 'outros',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- TRANSACTIONS - Transações financeiras
-- =============================================
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- income, expense, transfer
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_recurring BOOLEAN DEFAULT false,
  recurring_bill_id UUID REFERENCES public.recurring_bills(id) ON DELETE SET NULL,
  debtor_payment_id UUID REFERENCES public.debtor_payments(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'completed', -- pending, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- Enable RLS on all tables
-- =============================================
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debtors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debtor_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS Policies - Accounts
-- =============================================
CREATE POLICY "Users can view their own accounts" ON public.accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own accounts" ON public.accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own accounts" ON public.accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own accounts" ON public.accounts FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- RLS Policies - Debtors
-- =============================================
CREATE POLICY "Users can view their own debtors" ON public.debtors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own debtors" ON public.debtors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own debtors" ON public.debtors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own debtors" ON public.debtors FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- RLS Policies - Debtor Payments (via debtor ownership)
-- =============================================
CREATE POLICY "Users can view payments of their debtors" ON public.debtor_payments FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.debtors WHERE debtors.id = debtor_payments.debtor_id AND debtors.user_id = auth.uid()));
CREATE POLICY "Users can create payments for their debtors" ON public.debtor_payments FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.debtors WHERE debtors.id = debtor_payments.debtor_id AND debtors.user_id = auth.uid()));
CREATE POLICY "Users can update payments of their debtors" ON public.debtor_payments FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.debtors WHERE debtors.id = debtor_payments.debtor_id AND debtors.user_id = auth.uid()));
CREATE POLICY "Users can delete payments of their debtors" ON public.debtor_payments FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.debtors WHERE debtors.id = debtor_payments.debtor_id AND debtors.user_id = auth.uid()));

-- =============================================
-- RLS Policies - Debts
-- =============================================
CREATE POLICY "Users can view their own debts" ON public.debts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own debts" ON public.debts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own debts" ON public.debts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own debts" ON public.debts FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- RLS Policies - Recurring Bills
-- =============================================
CREATE POLICY "Users can view their own recurring bills" ON public.recurring_bills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own recurring bills" ON public.recurring_bills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own recurring bills" ON public.recurring_bills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own recurring bills" ON public.recurring_bills FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- RLS Policies - Transactions
-- =============================================
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transactions" ON public.transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own transactions" ON public.transactions FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- Trigger for updated_at
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON public.accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_debtors_updated_at BEFORE UPDATE ON public.debtors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_debts_updated_at BEFORE UPDATE ON public.debts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_recurring_bills_updated_at BEFORE UPDATE ON public.recurring_bills FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();