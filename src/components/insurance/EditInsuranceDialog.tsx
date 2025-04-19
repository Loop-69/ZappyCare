import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  patient_id: z.string().optional(),
  provider_type: z.string().min(1, { message: "Provider Type is required" }),
  insurance_provider: z.string().min(1, { message: "Insurance Provider is required" }),
  policy_number: z.string().min(1, { message: "Policy Number is required" }),
  verification_status: z.string().min(1, { message: "Verification Status is required" }),
  prior_authorization_required: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface EditInsuranceDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  record: any;
}

export const EditInsuranceDialog = ({ open, onClose, onSuccess, record }: EditInsuranceDialogProps) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: record.patient_id || "",
      provider_type: record.provider_type || "",
      insurance_provider: record.insurance_provider || "",
      policy_number: record.policy_number || "",
      verification_status: record.verification_status || "Pending",
      prior_authorization_required: record.prior_authorization_required || false,
    },
  });

  const editInsuranceMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { error } = await supabase
        .from("insurance_records")
        .update({
          ...values,
          updated_at: new Date().toISOString(),
        })
        .eq("id", record.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insurance_records"] });
      toast.success("Insurance record updated successfully");
      onSuccess();
      form.reset();
    },
    onError: (error: any) => {
      console.error("Error updating insurance record:", error);
      toast.error(`Failed to update insurance record: ${error.message}`);
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await editInsuranceMutation.mutateAsync(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Insurance Record</DialogTitle>
          <DialogDescription>
            Update the insurance record details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="provider_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Medical Insurance">Medical Insurance</SelectItem>
                      <SelectItem value="Dental Insurance">Dental Insurance</SelectItem>
                      <SelectItem value="Vision Insurance">Vision Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="insurance_provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insurance Provider</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter provider name" {...field} />
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
                    <Input placeholder="Enter policy number" {...field} />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
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

            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Updating..." : "Update Record"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};