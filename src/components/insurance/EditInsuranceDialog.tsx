import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { BaseModal } from '@/components/modals/BaseModal';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { InsuranceRecord } from '@/types/insurance-types'; // Correct import path

interface EditInsuranceDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  record: InsuranceRecord;
}

const formSchema = z.object({
  insurance_provider: z.string().min(1, { message: 'Insurance Provider is required.' }),
  provider_type: z.string().min(1, { message: 'Provider Type is required.' }),
  policy_number: z.string().nullable(),
  group_number: z.string().nullable(),
  verification_status: z.string().min(1, { message: 'Verification Status is required.' }),
  prior_authorization_required: z.boolean().nullable(),
  prior_authorization_status: z.string().nullable(),
  coverage_details: z.string().nullable(),
  notes: z.string().nullable(),
});

type EditInsuranceFormValues = z.infer<typeof formSchema>;

export function EditInsuranceDialog({ open, onClose, onSuccess, record }: EditInsuranceDialogProps) {
  const form = useForm<EditInsuranceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      insurance_provider: record.insurance_provider || '',
      provider_type: record.provider_type || '',
      policy_number: record.policy_number || '',
      group_number: record.group_number || '',
      verification_status: record.verification_status || '',
      prior_authorization_required: record.prior_authorization_required || false,
      prior_authorization_status: record.prior_authorization_status || '',
      coverage_details: record.coverage_details || '',
      notes: record.notes || '',
    },
  });

  useEffect(() => {
    if (record) {
      form.reset({
        insurance_provider: record.insurance_provider || '',
        provider_type: record.provider_type || '',
        policy_number: record.policy_number || '',
        group_number: record.group_number || '',
        verification_status: record.verification_status || '',
        prior_authorization_required: record.prior_authorization_required || false,
        prior_authorization_status: record.prior_authorization_status || '',
        coverage_details: record.coverage_details || '',
        notes: record.notes || '',
      });
    }
  }, [record, form]);

  const onSubmit = async (values: EditInsuranceFormValues) => {
    try {
      const { error } = await supabase
        .from('insurance_records')
        .update({
          insurance_provider: values.insurance_provider,
          provider_type: values.provider_type,
          policy_number: values.policy_number,
          group_number: values.group_number,
          verification_status: values.verification_status,
          prior_authorization_required: values.prior_authorization_required,
          prior_authorization_status: values.prior_authorization_status,
          coverage_details: values.coverage_details,
          notes: values.notes,
        })
        .eq('id', record.id);

      if (error) {
        toast.error('Failed to update insurance record.');
        console.error('Error updating insurance record:', error);
      } else {
        onSuccess();
      }
    } catch (error) {
      toast.error('An error occurred while updating insurance record.');
      console.error('Error in update insurance record:', error);
    }
  };

  return (
    <BaseModal
      title="Edit Insurance Record"
      isOpen={open}
      onClose={onClose}
    >
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Update the details of the insurance record.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="insurance_provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insurance Provider</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="provider_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="policy_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy Number</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} onChange={e => field.onChange(e.target.value || null)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="group_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Number</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} onChange={e => field.onChange(e.target.value || null)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="verification_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Verified">Verified</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="prior_authorization_required"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Prior Authorization Required
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="prior_authorization_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prior Authorization Status</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Denied">Denied</SelectItem>
                      <SelectItem value="N/A">N/A</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="coverage_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coverage Details</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value || ''} onChange={e => field.onChange(e.target.value || null)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value || ''} onChange={e => field.onChange(e.target.value || null)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </div>
    </BaseModal>
  );
}
