
import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ProductStatus } from "@/components/products/ProductStatus";

const ProductColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div>{row.original.type || "—"}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div>{row.original.category || "—"}</div>
    ),
  },
  {
    accessorKey: "fulfillment_source",
    header: "Source",
    cell: ({ row }) => (
      <div>{row.original.fulfillmentSource || "—"}</div>
    ),
  },
  {
    accessorKey: "one_time_price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.original.oneTimePrice;
      return price ? (
        <div>${parseFloat(price.toString()).toFixed(2)}</div>
      ) : (
        <div>—</div>
      );
    },
  },
  {
    accessorKey: "doses",
    header: "Doses",
    cell: ({ row }) => {
      const doses = row.original.doses;
      if (!doses || doses.length === 0) return <div>—</div>;
      return (
        <div className="flex flex-wrap gap-1">
          {doses.slice(0, 3).map((dose) => (
            <Badge key={dose.id} variant="outline">
              {dose.dose}
            </Badge>
          ))}
          {doses.length > 3 && (
            <Badge variant="outline">+{doses.length - 3}</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "stock_status",
    header: "Stock",
    cell: ({ row }) => {
      const status = row.original.stockStatus;
      if (!status) return <div>—</div>;
      
      let color = "bg-gray-100 text-gray-800";
      if (status === "In Stock") color = "bg-emerald-100 text-emerald-800";
      if (status === "Low Stock") color = "bg-amber-100 text-amber-800";
      if (status === "Out of Stock") color = "bg-red-100 text-red-800";
      
      return (
        <Badge className={`${color} border-none`}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <ProductStatus status={row.original.status as "Active" | "Inactive" | "Pending" | "Archived" || "Inactive"} />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              className="cursor-pointer flex items-center gap-2"
              onClick={() => console.log("Edit", product.id)}
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 flex items-center gap-2"
              onClick={() => console.log("Delete", product.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default ProductColumns;
