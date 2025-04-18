
import React, { useState } from "react";
import { BaseModal } from "@/components/modals/BaseModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tag } from "@/types/tag";

// Define schema for tag form validation
const tagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
  color: z.string().min(1, "Color is required")
});

type TagFormValues = z.infer<typeof tagSchema>;

interface TagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Tag;
}

export const TagDialog = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  initialData 
}: TagDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!initialData;
  
  // Initialize form with default values or initial data
  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: initialData || {
      name: "",
      color: "#6366f1" // Default color: indigo
    }
  });

  const handleSubmit = async (values: TagFormValues) => {
    setIsLoading(true);
    
    try {
      if (isEditing) {
        // Update existing tag
        const { error } = await supabase
          .from('tags')
          .update({
            name: values.name,
            color: values.color,
            updated_at: new Date().toISOString()
          })
          .eq('id', initialData.id);
          
        if (error) throw error;
        toast.success("Tag updated successfully");
      } else {
        // Create new tag
        const { error } = await supabase
          .from('tags')
          .insert({
            name: values.name,
            color: values.color
          });
          
        if (error) throw error;
        toast.success("Tag created successfully");
      }
      
      // Reset form and close dialog
      form.reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error saving tag:", error);
      toast.error(error.message || "Failed to save tag");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Tag" : "Add New Tag"}
      primaryAction={{
        label: isEditing ? "Update Tag" : "Create Tag",
        onClick: form.handleSubmit(handleSubmit),
        loading: isLoading,
        disabled: isLoading
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: onClose
      }}
    >
      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tag Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter tag name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    {...field}
                    className="w-16 h-9 p-1 cursor-pointer"
                  />
                  <Input
                    {...field}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </BaseModal>
  );
};
