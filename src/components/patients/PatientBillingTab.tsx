import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import { supabase } from '@/lib/supabase';

interface PaymentMethod {
  id: string;
  type: string;
  is_default: boolean;
  details: {
    last4?: string;
    expDate?: string;
    brand?: string;
  };
  created_at: string;
}

interface BillingRecord {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  description: string | null;
  invoice_id: string | null;
}

interface Subscription {
  id: string;
  name: string;
  status: string;
  amount: number;
  billing_cycle: string;
  next_billing_date: string | null;
}

export default function PatientBillingTab({ patientId }: { patientId: string }) {
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = useQuery<PaymentMethod[]>({
    queryKey: ['patientPaymentMethods', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: billingHistory, isLoading: isLoadingBillingHistory } = useQuery<BillingRecord[]>({
    queryKey: ['patientBillingHistory', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('billing_transactions')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: subscription, isLoading: isLoadingSubscription } = useQuery<Subscription | null>({
    queryKey: ['patientSubscription', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('patient_id', patientId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  return (
    <div className="space-y-4">
      {/* Payment Methods Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payment Methods</CardTitle>
          <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white">
            Update Payment Method
          </Button>
        </CardHeader>
        <CardContent>
          {paymentMethods?.length ? (
            <div>Payment methods list will go here</div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <p className="text-muted-foreground">No payment methods found</p>
              <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white">
                Add Payment Method
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History Section */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          {billingHistory?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{record.description || 'Payment'}</TableCell>
                    <TableCell className="text-right">
                      {record.currency === 'USD' ? '$' : ''}
                      {record.amount.toFixed(2)}
                      {record.currency !== 'USD' ? ` ${record.currency}` : ''}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        record.status === 'succeeded' ? 'default' : 
                        record.status === 'pending' ? 'secondary' : 
                        'destructive'
                      }>
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No billing history found for this patient</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription Summary Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subscription Summary</CardTitle>
          {!subscription && (
            <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white">
              Add Subscription
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan:</span>
                <span>{subscription.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={
                  subscription.status === 'active' ? 'default' : 
                  subscription.status === 'canceled' ? 'destructive' : 
                  'secondary'
                }>
                  {subscription.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span>${subscription.amount.toFixed(2)}/{subscription.billing_cycle}</span>
              </div>
              {subscription.next_billing_date && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Billing:</span>
                  <span>{new Date(subscription.next_billing_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Patient does not have an active subscription</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
