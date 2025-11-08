import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/api-config';
import { useToast } from '@/hooks/use-toast';
import { DoctorPatient, DoctorPatientsResponse } from '@/types/api';

export const useDoctorPatients = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [patients, setPatients] = useState<DoctorPatient[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const fetchPatients = useCallback(async (): Promise<DoctorPatientsResponse> => {
    setIsFetching(true);
    try {
      const response = await api.get<DoctorPatientsResponse>(API_ENDPOINTS.auth.doctorPatients);

      setPatients(response.patients);
      setTotalCount(response.total_count);

      return response;
    } catch (error: any) {
      console.error('[DoctorPatients] Fetch patients failed:', error.message);

      toast({
        title: 'Error',
        description: error.message || 'Failed to load patients',
        variant: 'destructive',
      });

      throw error;
    } finally {
      setIsFetching(false);
    }
  }, [toast]);

  return {
    fetchPatients,
    isFetching,
    patients,
    totalCount,
  };
};