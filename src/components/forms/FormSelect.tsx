
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FormSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function FormSelect({ value, onValueChange, placeholder = "Select a form..." }: FormSelectProps) {
  const { data: forms, isLoading } = useQuery({
    queryKey: ["forms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("form_templates")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return <div>Loading forms...</div>;
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {forms?.map((form) => (
          <SelectItem key={form.id} value={form.id}>
            {form.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
