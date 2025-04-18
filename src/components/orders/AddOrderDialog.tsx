import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { BaseModal } from "@/components/modals/BaseModal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { InfoIcon, Plus, Trash } from "lucide-react";

const OrderSchema = z.object({
  patient_id: z.string().uuid(),
  total_amount: z.coerce.number().min(0, "Total amount must be positive"),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
  pharmacy_id: z.string().uuid().optional(),
  session_id: z.string().uuid().optional(),
  notes: z.string().optional(),
  payment_method: z.string().optional(),
  items: z.array(
    z.object({
      medication_name: z.string().min(1, "Medication name is required"),
      quantity: z.coerce.number().int().positive("Quantity must be a positive number"),
      unit_price: z.coerce.number().min(0, "Price must be positive"),
    })
  ).min(1, "At least one medication item is required"),
});

interface AddOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  patientId?: string;
}

export const AddOrderDialog = ({ open, onOpenChange, onSuccess, patientId }: AddOrderDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof OrderSchema>>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      total_amount: 0,
      status: "pending",
      items: [{ medication_name: "", quantity: 1, unit_price: 0 }],
      patient_id: patientId || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        total_amount: 0,
        status: "pending",
        items: [{ medication_name: "", quantity: 1, unit_price: 0 }],
        patient_id: patientId || "",
      });
    }
  }, [open, patientId, form]);

  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("id, first_name, last_name");
      
      if (error) throw error;
      return data || [];
    },
    enabled: open,
  });
  
  const { data: pharmacies = [] } = useQuery({
    queryKey: ["pharmacies"],
    queryFn: async () => {
      // Mock data since we don't have a pharmacies table yet
      return [
        { id: "123e4567-e89b-12d3-a456-426614174000", name: "CVS Pharmacy" },
        { id: "223e4567-e89b-12d3-a456-426614174000", name: "Walgreens" },
        { id: "323e4567-e89b-12d3-a456-426614174000", name: "Rite Aid" }
      ];
    },
    enabled: open,
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("id, patient_id, scheduled_date");
      
      if (error) throw error;
      return data || [];
    },
    enabled: open,
  });

  const items = form.watch("items");
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    form.setValue("total_amount", total);
  }, [items, form]);

  const onSubmit = async (values: z.infer<typeof OrderSchema>) => {
    setIsLoading(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          patient_id: values.patient_id,
          total_amount: values.total_amount,
          status: values.status,
          pharmacy_id: values.pharmacy_id,
          session_id: values.session_id,
          notes: values.notes,
          payment_method: values.payment_method,
          order_date: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      const orderItems = values.items.map(item => ({
        order_id: order.id,
        medication_name: item.medication_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      queryClient.invalidateQueries({ queryKey: ["orders"] });
      if (values.patient_id) {
        queryClient.invalidateQueries({ queryKey: ["patient-orders", values.patient_id] });
      }

      toast({
        title: "Order Created",
        description: "Your order has been successfully created.",
      });

      if (onSuccess) {
        onSuccess();
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = () => {
    const currentItems = form.getValues("items") || [];
    form.setValue("items", [...currentItems, { medication_name: "", quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    if (currentItems.length > 1) {
      form.setValue("items", currentItems.filter((_, i) => i !== index));
    }
  };

  return (
    <BaseModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Create New Order"
      primaryAction={{
        label: "Create Order",
        onClick: form.handleSubmit(onSubmit),
        loading: isLoading,
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: () => onOpenChange(false),
      }}
    >
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="patient_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.first_name} {patient.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="pharmacy_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pharmacy</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a pharmacy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pharmacies.map((pharmacy) => (
                        <SelectItem key={pharmacy.id} value={pharmacy.id}>
                          {pharmacy.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="session_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Associated Session</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a session" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sessions
                        .filter(session => !patientId || session.patient_id === patientId)
                        .map((session) => (
                          <SelectItem key={session.id} value={session.id}>
                            {new Date(session.scheduled_date).toLocaleDateString()}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Order Items</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addItem}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </div>
            
            {form.watch("items").map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-center bg-muted/20 p-3 rounded-md">
                <div className="col-span-5">
                  <FormField
                    control={form.control}
                    name={`items.${index}.medication_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Medication</FormLabel>
                        <FormControl>
                          <Input placeholder="Medication name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Qty</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name={`items.${index}.unit_price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-2 flex justify-end items-end pt-1">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeItem(index)} 
                    disabled={form.watch("items").length === 1}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <Input placeholder="Credit Card, PayPal, etc." {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormLabel>Notes</FormLabel>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <p className="text-sm">Add any special instructions or notes about this order.</p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <FormControl>
                  <Textarea placeholder="Add any notes or special instructions" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-2 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount:</span>
              <span className="text-lg font-bold">
                ${form.watch("total_amount").toFixed(2)}
              </span>
            </div>
          </div>
        </form>
      </Form>
    </BaseModal>
  );
};
