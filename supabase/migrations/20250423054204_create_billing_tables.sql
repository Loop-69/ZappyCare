-- Create invoices table first if it doesn't exist
CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  amount numeric NOT NULL,
  status varchar(20) NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT invoices_pkey PRIMARY KEY (id),
  CONSTRAINT invoices_patient_id_fkey FOREIGN KEY (patient_id)
    REFERENCES public.patients (id) ON DELETE CASCADE
);

-- Create billing_transactions table
CREATE TABLE IF NOT EXISTS public.billing_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  subscription_id uuid NULL,
  amount numeric NOT NULL,
  currency varchar(3) NOT NULL DEFAULT 'USD',
  status varchar(20) NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  invoice_id uuid NULL,
  description text NULL,
  metadata jsonb NULL,
  CONSTRAINT billing_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT billing_transactions_patient_id_fkey FOREIGN KEY (patient_id)
    REFERENCES public.patients (id) ON DELETE CASCADE,
  CONSTRAINT billing_transactions_invoice_id_fkey FOREIGN KEY (invoice_id)
    REFERENCES public.invoices (id) ON DELETE SET NULL
);

-- Create index for faster patient billing queries
CREATE INDEX IF NOT EXISTS billing_transactions_patient_id_idx 
  ON public.billing_transactions (patient_id);

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS billing_transactions_status_idx 
  ON public.billing_transactions (status);

-- Add payment_method column to invoices table
ALTER TABLE public.invoices 
  ADD COLUMN IF NOT EXISTS payment_method_id uuid NULL,
  ADD COLUMN IF NOT EXISTS transaction_id uuid NULL;

-- Create foreign key to billing_transactions
ALTER TABLE public.invoices
  ADD CONSTRAINT invoices_transaction_id_fkey FOREIGN KEY (transaction_id)
  REFERENCES public.billing_transactions (id) ON DELETE SET NULL;

-- Create payment_methods table for future Stripe integration
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  type varchar(20) NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  details jsonb NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT payment_methods_pkey PRIMARY KEY (id),
  CONSTRAINT payment_methods_patient_id_fkey FOREIGN KEY (patient_id)
    REFERENCES public.patients (id) ON DELETE CASCADE
);

-- Create index for faster patient payment method queries
CREATE INDEX IF NOT EXISTS payment_methods_patient_id_idx 
  ON public.payment_methods (patient_id);

-- Add foreign key from invoices to payment_methods
ALTER TABLE public.invoices
  ADD CONSTRAINT invoices_payment_method_id_fkey FOREIGN KEY (payment_method_id)
