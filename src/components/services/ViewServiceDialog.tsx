
import { ServiceWithRelations } from "@/types/service";
import { BaseModal } from "../modals/BaseModal";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { format } from "date-fns";

interface ViewServiceDialogProps {
  service: ServiceWithRelations;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewServiceDialog = ({
  service,
  isOpen,
  onClose,
}: ViewServiceDialogProps) => {
  const handleClose = () => {
    // Call the parent's onClose function
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Service Details"
      size="md"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p>{service.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge
                variant={service.status === "Active" ? "default" : "secondary"}
                className={service.status === "Active" ? "bg-green-500" : "bg-gray-500"}
              >
                {service.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p>{service.description || "No description"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Requires Consultation</p>
              <div className="flex items-center space-x-2">
                <Checkbox checked={service.requires_consultation} disabled />
                <span>{service.requires_consultation ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Created & Updated</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p>{format(new Date(service.created_at), "MMM d, yyyy")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Updated At</p>
              <p>{format(new Date(service.updated_at), "MMM d, yyyy")}</p>
            </div>
          </div>
        </div>

        {service.products && service.products.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Associated Products</h3>
            <ul className="list-disc pl-5">
              {service.products.map((product) => (
                <li key={product.product_id}>{product.name}</li>
              ))}
            </ul>
          </div>
        )}

        {service.plans && service.plans.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Associated Plans</h3>
            <ul className="list-disc pl-5">
              {service.plans.map((plan) => (
                <li key={plan.plan_id}>{plan.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </BaseModal>
  );
};
