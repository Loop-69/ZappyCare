import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Discount } from "@/types";

interface DiscountActionsProps {
  discount: Discount;
  iconOnly?: boolean;
  onEdit?: (discount: Discount) => void;
  onDelete?: (discount: Discount) => void;
}

export const DiscountActions = ({ discount, iconOnly, onEdit, onDelete }: DiscountActionsProps) => {
  if (iconOnly) {
    return (
      <div className="flex gap-2">
        {onEdit && (
          <Button variant="ghost" size="icon" onClick={() => onEdit(discount)}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="icon" onClick={() => onDelete(discount)}>
            <Trash className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(discount)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem 
            className="text-destructive" 
            onClick={() => onDelete(discount)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
