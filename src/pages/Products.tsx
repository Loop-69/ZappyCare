
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, Plus, Search, Filter, Loader2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import PageLayout from "@/components/layout/PageLayout";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductColumns from "@/components/products/ProductColumns";
import AddProductDialog from "@/components/products/AddProductDialog";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

const Products = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_doses(*), product_services(*)");
      
      if (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products");
      }
      
      // Transform the data to match our Product type
      return data.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        description: item.description,
        fulfillmentSource: item.fulfillment_source,
        category: item.category,
        oneTimePrice: item.one_time_price,
        status: item.status || 'Inactive',
        stockStatus: item.stock_status || 'In Stock',
        interactionWarnings: item.interaction_warnings,
        requiresPrescription: item.requires_prescription,
        active: item.active,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        // Properly map product_doses to match ProductDose type
        doses: item.product_doses ? item.product_doses.map((dose: any) => ({
          id: dose.id,
          dose: dose.dose,
          description: dose.description,
          allowOneTimePurchase: dose.allow_one_time_purchase,
          product_id: dose.product_id,
          stripePriceIdSubscription: dose.stripe_price_id_subscription
        })) : [],
        product_services: item.product_services
      })) as Product[];
    },
  });
  
  const filteredProducts = products?.filter((product) => {
    const matchesSearch = searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  const uniqueCategories = products 
    ? [...new Set(products.map(product => product.category).filter(Boolean))]
    : [];
    
  return (
    <>
      <PageLayout 
        title="Products" 
        action={{
          label: "New Product",
          onClick: () => setIsAddDialogOpen(true),
          icon: <Plus size={16} />,
        }}
      >
        <div className="p-6 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="relative w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 items-center">
              <Filter size={16} className="text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category || ""}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <DataTable 
              columns={ProductColumns} 
              data={filteredProducts}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Package size={48} className="text-muted-foreground" />
              <div className="text-xl font-semibold text-muted-foreground">No products found</div>
              <Button onClick={() => setIsAddDialogOpen(true)}>Add a product</Button>
            </div>
          )}
        </div>
      </PageLayout>
      
      <AddProductDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)}
      />
    </>
  );
};

export default Products;
