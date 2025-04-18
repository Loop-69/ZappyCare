
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BaseModal } from "@/components/modals/BaseModal";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Discount } from "@/types";
import { BasicDiscountFields } from "./form-fields/BasicDiscountFields";
import { DiscountValueFields } from "./form-fields/DiscountValueFields";
import { DiscountStatusFields } from "./form-fields/DiscountStatusFields";

const discountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(3, "Code must be at least 3 characters"),
  description: z.string().optional(),
  type: z.enum(["Percentage", "Fixed"]),
  value: z.coerce.number().min(0, "Value must be a positive number"),
  status: z.enum(["Active", "Inactive"]),
});

export type DiscountFormData = z.infer<typeof discountSchema>;

interface EditDiscountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  discount: Discount;
  onDiscountUpdated?: () => void;
}

export const EditDiscountDialog = ({ 
  isOpen, 
  onClose,
  discount,
  onDiscountUpdated 
}: EditDiscountDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DiscountFormData>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      name: discount.name,
      code: discount.code,
      description: discount.description || "",
      type: discount.type as "Percentage" | "Fixed",
      value: discount.value,
      status: discount.status as "Active" | "Inactive",
    },
  });

  const onSubmit = async (data: DiscountFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('discounts')
        .update({
          name: data.name,
          code: data.code,
          description: data.description,
          type: data.type,
          value: data.value,
          status: data.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', discount.id);

      if (error) throw error;

      toast.success("Discount updated successfully");
      onDiscountUpdated?.();
      onClose();
    } catch (error) {
      console.error("Error updating discount:", error);
      toast.error("Failed to update discount");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Discount"
      primaryAction={{
        label: "Save Changes",
        onClick: form.handleSubmit(onSubmit),
        loading: isSubmitting,
      }}
      size="lg"
    >
      <Form {...form}>
        <form className="space-y-6">
          <BasicDiscountFields form={form} />
          <DiscountValueFields form={form} />
          <DiscountStatusFields form={form} />
        </form>
      </Form>
    </BaseModal>
  );
};
