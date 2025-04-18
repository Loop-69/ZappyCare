
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Package, Plus, X, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Product, ProductDose } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().optional(),
  fulfillmentSource: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  oneTimePrice: z.string().optional(),
  interactionWarnings: z.string().optional(),
  requiresPrescription: z.boolean().default(false),
  status: z.enum(["Active", "Inactive", "Pending", "Archived"]).default("Active"),
  stockStatus: z.enum(["In Stock", "Low Stock", "Out of Stock"]).default("In Stock"),
});

type ProductSchemaType = z.infer<typeof productSchema>;

const emptyDose = {
  id: crypto.randomUUID(),
  dose: "",
  description: "",
  allowOneTimePurchase: false,
};

type AddProductDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddProductDialog = ({ isOpen, onClose }: AddProductDialogProps) => {
  const [doses, setDoses] = useState<(ProductDose & { isNew?: boolean })[]>([
    { ...emptyDose, isNew: true },
  ]);
  const [services, setServices] = useState<string[]>([]);
  const [serviceInput, setServiceInput] = useState("");
  const queryClient = useQueryClient();
  
  const form = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
      fulfillmentSource: "",
      category: "",
      oneTimePrice: "",
      interactionWarnings: "",
      requiresPrescription: false,
      status: "Active",
      stockStatus: "In Stock",
    },
  });
  
  const createProduct = useMutation({
    mutationFn: async (formData: ProductSchemaType) => {
      // Insert the product
      const { data: productData, error: productError } = await supabase
        .from("products")
        .insert({
          name: formData.name,
          type: formData.type,
          description: formData.description || null,
          fulfillment_source: formData.fulfillmentSource || null,
          category: formData.category,
          one_time_price: formData.oneTimePrice ? parseFloat(formData.oneTimePrice) : null,
          interaction_warnings: formData.interactionWarnings || null,
          requires_prescription: formData.requiresPrescription,
          status: formData.status,
          stock_status: formData.stockStatus,
        })
        .select("id")
        .single();
        
      if (productError) throw productError;
      
      const productId = productData.id;
      
      // Insert the product doses
      const validDoses = doses.filter(dose => dose.dose.trim() !== "");
      if (validDoses.length > 0) {
        const dosesForInsert = validDoses.map(dose => ({
          product_id: productId,
          dose: dose.dose,
          description: dose.description || null,
          allow_one_time_purchase: dose.allowOneTimePurchase,
        }));
        
        const { error: dosesError } = await supabase
          .from("product_doses")
          .insert(dosesForInsert);
          
        if (dosesError) throw dosesError;
      }
      
      // Insert the product services
      if (services.length > 0) {
        const servicesForInsert = services.map(service => ({
          product_id: productId,
          service_name: service,
        }));
        
        const { error: servicesError } = await supabase
          .from("product_services")
          .insert(servicesForInsert);
          
        if (servicesError) throw servicesError;
      }
      
      return productData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
      resetForm();
      onClose();
    },
    onError: (error) => {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    },
  });
  
  const handleSubmit = (formData: ProductSchemaType) => {
    createProduct.mutate(formData);
  };
  
  const addDose = () => {
    setDoses([...doses, { ...emptyDose, isNew: true }]);
  };
  
  const updateDose = (index: number, field: keyof ProductDose, value: any) => {
    const updatedDoses = [...doses];
    updatedDoses[index] = {
      ...updatedDoses[index],
      [field]: value,
    };
    setDoses(updatedDoses);
  };
  
  const removeDose = (index: number) => {
    const updatedDoses = [...doses];
    updatedDoses.splice(index, 1);
    setDoses(updatedDoses);
  };
  
  const addService = () => {
    if (serviceInput.trim() && !services.includes(serviceInput.trim())) {
      setServices([...services, serviceInput.trim()]);
      setServiceInput("");
    }
  };
  
  const removeService = (index: number) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };
  
  const resetForm = () => {
    form.reset();
    setDoses([{ ...emptyDose, isNew: true }]);
    setServices([]);
    setServiceInput("");
  };
  
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Product"
      size="xl"
      primaryAction={{
        label: "Create Product",
        onClick: form.handleSubmit(handleSubmit),
        loading: createProduct.isPending,
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: onClose,
      }}
    >
      <Form {...form}>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type *</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Medication">Medication</SelectItem>
                            <SelectItem value="Supplement">Supplement</SelectItem>
                            <SelectItem value="Accessory">Accessory</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Hair">Hair</SelectItem>
                            <SelectItem value="ED">ED</SelectItem>
                            <SelectItem value="Skincare">Skincare</SelectItem>
                            <SelectItem value="Weight Management">Weight Management</SelectItem>
                            <SelectItem value="Mental Health">Mental Health</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter product description" 
                        className="min-h-[100px]" 
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fulfillmentSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fulfillment Source</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || ''}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Internal">Internal</SelectItem>
                            <SelectItem value="External Pharmacy">External Pharmacy</SelectItem>
                            <SelectItem value="Drop Shipping">Drop Shipping</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="oneTimePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-time Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0.00"
                          type="number" 
                          step="0.01"
                          min="0"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="interactionWarnings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interaction Warnings</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter any interaction warnings" 
                        className="min-h-[80px]" 
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Product Doses</h3>
                <div className="space-y-3 mb-3">
                  {doses.map((dose, index) => (
                    <div key={dose.id} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <Input
                          placeholder="Dose (e.g., 10mg)"
                          value={dose.dose}
                          onChange={(e) => updateDose(index, "dose", e.target.value)}
                          className="mb-2"
                        />
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={dose.allowOneTimePurchase}
                            onCheckedChange={(checked) => updateDose(index, "allowOneTimePurchase", checked)}
                          />
                          <span className="text-xs text-muted-foreground">
                            Allow one-time purchase
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDose(index)}
                        disabled={doses.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={addDose}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Dose
                </Button>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Associated Services</h3>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Enter service name"
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addService}
                  >
                    Add
                  </Button>
                </div>
                {services.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {services.map((service, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {service}
                        <button 
                          type="button"
                          onClick={() => removeService(index)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="stockStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Status</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="In Stock">In Stock</SelectItem>
                            <SelectItem value="Low Stock">Low Stock</SelectItem>
                            <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="requiresPrescription"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Requires Prescription</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Check this if the product requires a prescription to be dispensed
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </BaseModal>
  );
};

export default AddProductDialog;
