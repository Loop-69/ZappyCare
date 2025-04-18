
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pharmacy } from "@/types";

interface PharmacyTableProps {
  pharmacies: Pharmacy[];
  isLoading: boolean;
}

export const PharmacyTable = ({ pharmacies, isLoading }: PharmacyTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>States Served</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pharmacies && pharmacies.length > 0 ? (
          pharmacies.map((pharmacy) => (
            <TableRow key={pharmacy.id}>
              <TableCell className="font-medium">{pharmacy.name}</TableCell>
              <TableCell>
                {pharmacy.type.charAt(0).toUpperCase() + pharmacy.type.slice(1).replace("_", " ")}
              </TableCell>
              <TableCell>
                <div>{pharmacy.contact_name}</div>
                <div className="text-sm text-muted-foreground">{pharmacy.contact_email}</div>
              </TableCell>
              <TableCell>
                <PharmacyStates states={pharmacy.states_served} />
              </TableCell>
              <TableCell>
                <Badge variant={pharmacy.active ? "default" : "secondary"}>
                  {pharmacy.active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              {isLoading
                ? "Loading..."
                : pharmacies?.length === 0
                ? "No pharmacies found."
                : "No pharmacies available."}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

interface PharmacyStatesProps {
  states: string[] | null;
}

const PharmacyStates = ({ states }: PharmacyStatesProps) => {
  if (!states || states.length === 0) {
    return <span className="text-muted-foreground">None</span>;
  }

  if (states.length <= 3) {
    return (
      <div className="flex flex-wrap gap-1">
        {states.map((state) => (
          <Badge key={state} variant="outline">
            {state}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {states.slice(0, 2).map((state) => (
        <Badge key={state} variant="outline">
          {state}
        </Badge>
      ))}
      <Badge variant="outline">+{states.length - 2}</Badge>
    </div>
  );
};
