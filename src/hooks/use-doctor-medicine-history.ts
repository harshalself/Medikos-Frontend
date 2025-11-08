import { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';

interface SelectedAlternative {
  generic_name: string;
  confidence_score: number;
}

interface MedicineSearch {
  id: number;
  user_id: string;
  branded_medicine_name: string;
  search_type: string;
  session_id?: string;
  user_agent?: string;
  ip_address?: string;
  created_at: string;
  selected_alternative?: SelectedAlternative;
}

interface MedicineHistoryResponse {
  searches: MedicineSearch[];
  total_count: number;
  limit: number;
  offset: number;
}

interface UseMedicineHistoryReturn {
  data: MedicineHistoryResponse | null;
  loading: boolean;
  error: string | null;
  refetch: (limit?: number, offset?: number) => void;
}

export const useDoctorMedicineHistory = (
  initialLimit: number = 50,
  initialOffset: number = 0
): UseMedicineHistoryReturn => {
  const [data, setData] = useState<MedicineHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(initialLimit);
  const [offset, setOffset] = useState(initialOffset);

  const fetchMedicineHistory = async (newLimit?: number, newOffset?: number) => {
    try {
      setLoading(true);
      setError(null);

      const currentLimit = newLimit !== undefined ? newLimit : limit;
      const currentOffset = newOffset !== undefined ? newOffset : offset;

      if (newLimit !== undefined) setLimit(newLimit);
      if (newOffset !== undefined) setOffset(newOffset);

      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const queryParams = new URLSearchParams({
        limit: currentLimit.toString(),
        offset: currentOffset.toString(),
      });

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.medicineSuggester.doctorHistory}?${queryParams}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access denied. Doctor role required.');
        }
        throw new Error(`Failed to fetch medicine history: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load medicine history';
      setError(errorMessage);
      console.error('Error fetching medicine history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicineHistory();
  }, []);

  const refetch = (newLimit?: number, newOffset?: number) => {
    fetchMedicineHistory(newLimit, newOffset);
  };

  return { data, loading, error, refetch };
};
