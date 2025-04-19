
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { InsuranceActions } from "./InsuranceActions";
import { InsuranceRecord } from "@/types/insurance-types";

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  return format(new Date(dateString), "MM/dd/yyyy");
};

const StatusBadge = ({ status }: { status: string }) => {
  const statusColors = {
    "Pending": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    "Verified": "bg-green-100 text-green-800 hover:bg-green-200",
    "Rejected": "bg-red-100 text-red-800 hover:bg-red-200"
  };

  return (
    <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"} variant="outline">
      {status}
    </Badge>
  );
};

export const InsuranceColumns: ColumnDef<InsuranceRecord>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "patient",
    header: "PATIENT",
    accessorFn: (row) => {
      const patient = row.patients;
      return patient ? `${patient.first_name} ${patient.last_name}` : "Patient ID: undefined";
    },
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorKey: "insurance_provider",
    header: "INSURANCE PROVIDER",
  },
  {
    id: "policy_group",
    header: "POLICY/GROUP",
    accessorFn: (row) => {
      const policy = row.policy_number || "N/A";
      const group = row.group_number || "N/A";
      return `${policy}\n${group}`;
    },
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorKey: "verification_status",
    header: "VERIFICATION",
    cell: ({ row }) => <StatusBadge status={row.original.verification_status} />,
  },
  {
    accessorKey: "prior_authorization_status",
    header: "PRIOR AUTHORIZATION",
    cell: ({ row }) => {
      const status = row.original.prior_authorization_status || "Pending";
      return <StatusBadge status={status} />;
    },
  },
  {
    accessorKey: "updated_at",
    header: "LAST UPDATED",
    cell: ({ row }) => formatDate(row.original.updated_at),
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row, cell }) => {
      // Access onViewDetails from the column definition or context if needed
      // For now, assuming it's passed directly as a prop to the component rendering the table
      // This needs to be handled in the component rendering the DataTable (Insurance.tsx)
      // The type error here indicates that the cell context doesn't automatically know about onViewDetails
      // We need to ensure onViewDetails is passed down correctly from Insurance.tsx to the cell
      // In Insurance.tsx, we are already mapping columns and adding onViewDetails to the actions column
      // The issue might be in how the DataTable component handles and passes props to the cell render function
      // However, based on the previous error in Insurance.tsx, it seems the onViewDetails prop is expected on InsuranceActions
      // Let's assume for now that the DataTable correctly passes down the props defined in the column mapping
      // The error in InsuranceColumns.tsx might be a red herring or related to the type definition of ColumnDef itself
      // Let's try to explicitly type the cell function if possible, or rely on the mapping in Insurance.tsx

      // Re-evaluating the error in Insurance.tsx: "Property 'onViewDetails' does not exist on type 'IntrinsicAttributes & { record: any; }'"
      // This error is in Insurance.tsx when mapping the columns and passing onViewDetails to InsuranceActions
      // This means the type definition for InsuranceActionsProps is not being correctly applied or recognized in Insurance.tsx during the map
      // Let's ensure the import of InsuranceActionsProps is correct in Insurance.tsx (it's not imported there, only InsuranceActions component)
      // I need to import InsuranceActionsProps in Insurance.tsx to fix the type error there.

      // The error in InsuranceColumns.tsx "Property 'onViewDetails' is missing in type '{ record: InsuranceRecord; }' but required in type 'InsuranceActionsProps'"
      // This error is happening because the default type inference for the cell function's `row.original` is `any` or a generic type, not `InsuranceRecord` with the added `onViewDetails`.
      // We need to ensure the type of `row.original` within the cell function is correctly `InsuranceRecord` and that `onViewDetails` is accessible.

      // Let's modify the cell definition to explicitly type `row.original` and assume `onViewDetails` is available through the column definition or context.
      // However, the standard ColumnDef cell signature is `({ row, cell })`. Custom props passed during column mapping are usually accessed differently or require extending ColumnDef types.

      // A simpler approach that aligns with the current structure is to ensure the `InsuranceActions` component itself is correctly typed and that `Insurance.tsx` passes the required props.
      // The error in InsuranceColumns.tsx is likely a consequence of the error in Insurance.tsx where the type mismatch occurs when passing props to InsuranceActions during the column map.

      // Let's go back to fixing the errors in Insurance.tsx first, as they seem to be the root cause.
      // The remaining errors in Insurance.tsx are:
      // 1. useQuery type mismatch (related to patients property)
      // 2. Type mismatch for props in AddInsuranceDialog and EditInsuranceDialog

      // Let's re-examine the useQuery type mismatch. The error message "Types of property 'patients' are incompatible. Type '{ error: true; } & String' is missing the following properties from type '{ id: string; first_name: string; last_name: string; email: string; }': id, first_name, last_name, email"
      // This strongly suggests that the joined `patients` data from Supabase is sometimes returning an error object or a string representation of an error, instead of the expected patient object or null.
      // This could happen if there's an issue with RLS policies, or the join itself.

      // To work around this type error and proceed with the task, I can modify the `InsuranceRecord` type to accommodate this unexpected type for `patients`, or handle this potential error case in the `queryFn`.
      // A safer approach is to handle the potential error in the `queryFn` and ensure the returned data conforms to the `InsuranceRecord` type.

      // Let's modify the `queryFn` in `Insurance.tsx` to check if `patients` is an error object and handle it, ensuring the returned `patients` property is either the correct patient object or null.

      // I will use replace_in_file on Insurance.tsx again.
      // I will modify the mapping logic within the queryFn to explicitly check the type of `record.patients` after the select.

      // However, the previous replace_in_file on Insurance.tsx also failed. I should use write_to_file for Insurance.tsx to ensure the changes are applied correctly.

      // Let's formulate the complete corrected content for Insurance.tsx, addressing the useQuery type issue and the InsuranceActions import.

      // Corrected Insurance.tsx content:
      // Import InsuranceActionsProps
      // In useQuery, after fetching data, map over the data and explicitly check if record.patients is an object with an 'id' property to consider it a valid patient object, otherwise set it to null.
      // This will ensure the returned data array conforms to the InsuranceRecord[] type.
      // The InsuranceActions import error should be fixed by adding the import statement.
      // The prop type errors for AddInsuranceDialog and EditInsuranceDialog will be addressed after fixing Insurance.tsx.

      // Let's proceed with writing the corrected content to Insurance.tsx.
      // I will use write_to_file for src/pages/Insurance.tsx.
      // The content will include the import for InsuranceActions and the modified queryFn.

      // Since I am planning to use write_to_file for Insurance.tsx, I should not use replace_in_file on InsuranceColumns.tsx in this turn. I will address the error in InsuranceColumns.tsx after fixing Insurance.tsx.
      // The error in InsuranceColumns.tsx is likely a consequence of the type errors in Insurance.tsx. Fixing Insurance.tsx might resolve the error in InsuranceColumns.tsx automatically due to better type inference.

      // So, the next step is to use write_to_file for Insurance.tsx with the corrected content.
      // I will formulate the complete content for Insurance.tsx in the next turn.
      // I need to make sure the import for InsuranceActions is present and the queryFn handles the potential type issue with patients.

      // Let's prepare the content for Insurance.tsx.
      // I will add the import for InsuranceActions.
      // In the queryFn, after the supabase select, I will add a .then() or modify the existing logic to process the data and ensure the patients property is correctly typed.

      // Example of modified queryFn logic:
      /*
      queryFn: async () => {
        try {
          const { data, error } = await supabase
            .from('insurance_records')
            .select('*, patients(id, first_name, last_name, email)')
            .order('created_at', { ascending: false });

          if (error) {
            toast.error("Failed to fetch insurance records");
            console.error("Error fetching insurance records:", error);
            return [];
          }

          // Process data to ensure patients property conforms to InsuranceRecord type
          const processedData: InsuranceRecord[] = data.map(record => ({
            ...record,
            patients: (record.patients && typeof record.patients === 'object' && 'id' in record.patients)
              ? record.patients as { id: string; first_name: string; last_name: string; email: string | null; }
              : null
          }));

          return processedData;
        } catch (error) {
          console.error("Error in insurance records query:", error);
          toast.error("An error occurred while fetching insurance records");
          return [];
        }
      }
      */

      // This approach explicitly checks if `record.patients` is a valid object with an `id` before casting it, otherwise sets it to null. This should align the data type with `InsuranceRecord[]`.

      // I will now proceed to write the complete corrected content to src/pages/Insurance.tsx using write_to_file.
      // I will not use replace_in_file on InsuranceColumns.tsx in this turn.
      // I will also need to check the prop types for AddInsuranceDialog and EditInsuranceDialog after this.
    }
  },
];
