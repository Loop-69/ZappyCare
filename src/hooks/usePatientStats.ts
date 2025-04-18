
import { useActivePatientsCount, useRecentFormsCount, useTotalPatientsCount, useUpcomingSessionsCount } from "./queries/usePatientQueries";

export const usePatientStats = () => {
  const { data: totalPatients, isLoading: isLoadingTotal } = useTotalPatientsCount();
  const { data: activePatients, isLoading: isLoadingActive } = useActivePatientsCount();
  const { data: upcomingSessions, isLoading: isLoadingUpcoming } = useUpcomingSessionsCount();
  const { data: recentForms, isLoading: isLoadingForms } = useRecentFormsCount();

  const isLoading = isLoadingTotal || isLoadingActive || isLoadingUpcoming || isLoadingForms;

  return {
    data: {
      totalPatients,
      activePatients,
      upcomingSessions,
      recentForms
    },
    isLoading
  };
};
