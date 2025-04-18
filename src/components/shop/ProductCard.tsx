
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Product, ProductDose } from "@/types/product-types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        {/* Product Image Placeholder */}
        <div className="bg-gray-100 h-48 rounded-lg mb-4 flex items-center justify-center">
          <div className="text-gray-400">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            {product.requiresPrescription && (
              <Badge variant="secondary" className="text-xs">
                Requires Rx
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500">{product.description}</p>
          <div className="text-sm font-medium text-gray-700">
            {product.category}
          </div>

          {product.doses && product.doses.length > 0 && (
            <Select defaultValue={product.doses[0].id}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Dose" />
              </SelectTrigger>
              <SelectContent>
                {product.doses.map((dose: ProductDose) => (
                  <SelectItem key={dose.id} value={dose.id}>
                    {dose.dose}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="font-bold text-xl">
              ${product.oneTimePrice?.toFixed(2)}
              <span className="text-xs text-gray-500 ml-1">one-time</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={product.requiresPrescription ? "secondary" : "default"}
        >
          {product.requiresPrescription ? (
            <>
              <Clock className="w-4 h-4 mr-2" />
              Requires Rx
            </>
          ) : (
            "Add to Cart"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
