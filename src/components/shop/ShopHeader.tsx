
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface ShopHeaderProps {
  onSearch: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function ShopHeader({ onSearch, onCategoryChange }: ShopHeaderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Shop</h1>
        <p className="text-muted-foreground">Explore recommended products and supplements</p>
      </div>
      
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Select defaultValue="all" onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="weight-management">Weight Management</SelectItem>
            <SelectItem value="supplements">Supplements</SelectItem>
            <SelectItem value="medications">Medications</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
