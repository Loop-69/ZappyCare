import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const OrderSchema = z.object({
  patient_id: z.string().uuid(),
  total_amount: z.coerce.number().min(0, 'Total amount must be positive'),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).default('pending'),
  pharmacy_id: z.string().uuid().optional(),
  session_id: z.string().uuid().optional(),
  notes: z.string().optional(),
  payment_method: z.string().optional(),
  items: z.array(
    z.object({
      medication_name: z.string().min(1, 'Medication name is required'),
      quantity: z.coerce.number().int().positive('Quantity must be a positive number'),
      unit_price: z.coerce.number().min(0, 'Price must be positive'),
    })
  ).min(1, 'At least one medication item is required'),
});

export const useOrderForm = () => {
  return useForm<z.infer<typeof OrderSchema>>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      total_amount: 0,
      status: 'pending',
      items: [{ medication_name: '', quantity: 1, unit_price: 0 }],
    },
  });
};

export const useOrderQueries = () => {
  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('id, first_name, last_name');
      
      if (error) throw error;
      return data || [];
    },
  });
  
  const { data: pharmacies = [] } = useQuery({
    queryKey: ['pharmacies'],
    queryFn: async () => {
      return [
        { id: '123e4567-e89b-12d3-a456-426614174000', name: 'CVS Pharmacy' },
        { id: '223e4567-e89b-12d3-a456-426614174000', name: 'Walgreens' },
        { id: '323e4567-e89b-12d3-a456-426614174000', name: 'Rite Aid' }
      ];
    },
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select('id, patient_id, scheduled_date');
      
      if (error) throw error;
      return data || [];
    },
  });

  return { patients, pharmacies, sessions };
};

export const useOrderItems = (form: any) => {
  const items = form.watch('items');

  const addItem = () => {
    const currentItems = form.getValues('items') || [];
    form.setValue('items', [...currentItems, { medication_name: '', quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues('items');
    if (currentItems.length > 1) {
      form.setValue('items', currentItems.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    form.setValue('total_amount', total);
  }, [items, form]);

  return { items, addItem, removeItem };
};