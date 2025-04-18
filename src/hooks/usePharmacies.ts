
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Pharmacy } from "@/types";

export const usePharmacies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: pharmacies, isLoading } = useQuery({
    queryKey: ["pharmacies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pharmacies")
        .select("*");
      
      if (error) {
        throw error;
      }
      
      return data as Pharmacy[];
    },
  });

  const filteredPharmacies = pharmacies?.filter((pharmacy) => {
    const matchesSearch = 
      pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharmacy.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharmacy.contact_email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || pharmacy.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return {
    pharmacies: filteredPharmacies,
    isLoading,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter
  };
};
