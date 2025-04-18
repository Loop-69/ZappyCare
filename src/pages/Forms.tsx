
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FormList } from "@/components/forms/FormList";
import { FormsHeader } from "@/components/forms/FormsHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface FormTemplate {
  id: string;
  title: string;
  description: string | null;
  status: string;
  fields: any[];
  created_at: string | null;
  updated_at: string | null;
  submission_count: number;
}

export default function Forms() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Forms");

  const { data: forms, isLoading } = useQuery({
    queryKey: ["forms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("form_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching forms:", error);
        throw error;
      }
      return data as FormTemplate[] || [];
    },
  });

  const filteredForms = forms?.filter((form: FormTemplate) => {
    // Always apply search filter if there's a search query
    if (searchQuery) {
      return form.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    // Since we don't have a type field, we'll skip filtering by type if it's "All Forms"
    if (selectedType !== "All Forms") {
      // For now, we'll just return no results for specific type selections
      // Later, we could add a type field to the database or infer types from other fields
      return false;
    }
    
    return true;
  });

  return (
    <PageLayout
      title="Forms"
      description="Manage your form templates and submissions"
      isLoading={isLoading}
    >
      <div className="flex justify-between items-center mb-6">
        <FormsHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />
        <Link to="/forms/builder">
          <Button className="ml-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create New Form
          </Button>
        </Link>
      </div>

      <FormList forms={filteredForms || []} />
    </PageLayout>
  );
}
