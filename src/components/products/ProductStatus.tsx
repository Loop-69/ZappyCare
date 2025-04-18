
import { Badge } from "@/components/ui/badge";
import { Status } from "@/types";

type ProductStatusProps = {
  status: Status;
};

export const ProductStatus = ({ status }: ProductStatusProps) => {
  let color = "bg-gray-100 text-gray-800";
  
  switch (status) {
    case "Active":
      color = "bg-emerald-100 text-emerald-800";
      break;
    case "Inactive":
      color = "bg-gray-100 text-gray-800";
      break;
    case "Pending":
      color = "bg-amber-100 text-amber-800";
      break;
    case "Archived":
      color = "bg-red-100 text-red-800";
      break;
    default:
      color = "bg-gray-100 text-gray-800";
  }
  
  return (
    <Badge className={`${color} border-none`}>
      {status}
    </Badge>
  );
};

export default ProductStatus;
