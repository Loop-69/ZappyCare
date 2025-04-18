
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PageLayout from "@/components/layout/PageLayout";
import { FormBuilderSidebar } from "@/components/form-builder/FormBuilderSidebar";
import { FormBuilderCanvas } from "@/components/form-builder/FormBuilderCanvas";
import { FormFieldsProvider } from "@/components/form-builder/FormFieldsProvider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: string | string[] | boolean;
  width?: "full" | "half";
}

export default function FormBuilder() {
  const [formData, setFormData] = useState({
    title: "New Form",
    description: "",
    fields: [] as FormField[],
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (formData.fields.length === 0) {
      toast.error("Please add at least one field to the form");
      return;
    }
    
    setSaving(true);
    try {
      // Save form to database using the edge function
      const { data, error } = await supabase.functions.invoke('save-form', {
        body: formData,
      });
      
      if (error) throw new Error(error.message);
      
      toast.success("Form saved successfully!");
      navigate("/forms");
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error("Failed to save form");
    } finally {
      setSaving(false);
    }
  };
  
  const handleFieldsChange = (fields: FormField[]) => {
    setFormData({
      ...formData,
      fields,
    });
  };

  const handleFormDataChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  return (
    <PageLayout
      title={`Form Builder: ${formData.title}`}
      description="Create and customize form templates with drag-and-drop"
    >
      <div className="flex justify-end mb-4 gap-2">
        <Button variant="outline" onClick={() => navigate("/forms")}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={saving}
        >
          {saving ? "Creating..." : "Create Form"}
        </Button>
      </div>
      
      <DndProvider backend={HTML5Backend}>
        <FormFieldsProvider>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <FormBuilderSidebar />
            </div>
            <div className="md:col-span-3">
              <FormBuilderCanvas 
                formData={formData}
                onFormDataChange={handleFormDataChange}
                onFieldsChange={handleFieldsChange}
              />
            </div>
          </div>
        </FormFieldsProvider>
      </DndProvider>
    </PageLayout>
  );
}
