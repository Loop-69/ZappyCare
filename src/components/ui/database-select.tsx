import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  FormControl,
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

interface DatabaseSelectProps {
  table: string;
  valueField: string;
  displayField: string | ((item: any) => string);
  value: string;
  onChange: (value: string) => void;
  onItemSelect?: (item: any) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  queryKey?: string;
  filter?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
}

export function DatabaseSelect({
  table,
  valueField,
  displayField,
  value,
  onChange,
  onItemSelect,
  label,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  queryKey,
  filter,
  orderBy,
}: DatabaseSelectProps) {
  const { data: items = [], isLoading } = useQuery({
    queryKey: [queryKey || `${table}-select`, filter],
    queryFn: async () => {
      let query = supabase.from(table).select("*");
      
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      if (orderBy) {
        query = query.order(orderBy.column, { 
          ascending: orderBy.ascending !== false 
        });
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleValueChange = (newValue: string) => {
    onChange(newValue);
    if (onItemSelect) {
      const selectedItem = items.find((item) => item[valueField] === newValue);
      if (selectedItem) {
        onItemSelect(selectedItem);
      }
    }
  };

  const getDisplayValue = (item: any) => {
    if (typeof displayField === "function") {
      return displayField(item);
    }
    return item[displayField];
  };

  return (
    <FormItem>
      {label && <FormLabel>{label}{required && " *"}</FormLabel>}
      <Select
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled || isLoading}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : items.length > 0 ? (
            items.map((item) => (
              <SelectItem key={item[valueField]} value={item[valueField]}>
                {getDisplayValue(item)}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>
              No items found
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}