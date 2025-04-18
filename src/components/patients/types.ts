
import { z } from "zod";

export const patientFormSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  status: z.string().default("Active"),
  address_line1: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  country: z.string().default("United States"),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;
