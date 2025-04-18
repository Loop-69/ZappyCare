
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PharmacyFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
}

export const PharmacyFilters = ({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
}: PharmacyFiltersProps) => {
  return (
    <div className="flex gap-4 w-full">
      <Input
        placeholder="Search pharmacies..."
        className="max-w-md"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="retail">Retail</SelectItem>
          <SelectItem value="hospital">Hospital</SelectItem>
          <SelectItem value="compounding">Compounding</SelectItem>
          <SelectItem value="specialty">Specialty</SelectItem>
          <SelectItem value="mail_order">Mail Order</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
