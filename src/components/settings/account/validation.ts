
import { z } from "zod";

export const personalInformationSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s.]+$/, "Name can only contain letters, spaces, and periods"),
  email: z.string()
    .email("Invalid email address"),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  title: z.string()
    .min(2, "Title must be at least 2 characters"),
  specialty: z.string()
    .min(2, "Specialty must be at least 2 characters"),
  licenseNumber: z.string()
    .min(5, "License number must be at least 5 characters")
});

export type PersonalInformationFormData = z.infer<typeof personalInformationSchema>;
