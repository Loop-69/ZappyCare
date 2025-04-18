
import React, { useState } from "react";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product-types";

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          doses:product_doses(*)
        `)
        .eq('active', true);
      
      if (error) throw error;
      return data as Product[];
    },
  });

  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === "all" || product.category?.toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <ShopHeader 
        onSearch={setSearchQuery}
        onCategoryChange={setCategory}
      />
      <div className="mt-8">
        {isLoading ? (
          <div className="text-center">Loading products...</div>
        ) : (
          <ProductGrid products={filteredProducts || []} />
        )}
      </div>
    </div>
  );
};

export default Shop;
