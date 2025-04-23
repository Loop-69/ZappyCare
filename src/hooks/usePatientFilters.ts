import { useCallback } from "react";
import { PatientData } from "@/components/patients/PatientColumns";

export const usePatientFilters = () => {
  const filterPatients = useCallback((patients: PatientData[], term: string, status: string) => {
    return patients.filter(patient => {
      const matchesSearch = term === "" ||
                          patient.first_name.toLowerCase().includes(term.toLowerCase()) ||
                          patient.last_name.toLowerCase().includes(term.toLowerCase()) ||
                          patient.email?.toLowerCase().includes(term.toLowerCase()) ||
                          patient.phone?.includes(term);
      const matchesStatus = status === "" || status === "all" || patient.status === status;
      return matchesSearch && matchesStatus;
    });
  }, []);

  return {
    filterPatients
  };
};
