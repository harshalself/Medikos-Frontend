import { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';
import { DiaryEntry, DiaryListResponse, HealthSummary } from '@/types/diary';

interface UsePatientHealthDiaryReturn {
  entries: DiaryEntry[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  summary: HealthSummary | null;
  loadingSummary: boolean;
  refetch: (filters?: DiaryFilters) => void;
  fetchSummary: () => void;
}

interface DiaryFilters {
  startDate?: string;
  endDate?: string;
  mood?: string;
  limit?: number;
  offset?: number;
}

export const useDoctorPatientHealthDiary = (patientId: string | undefined): UsePatientHealthDiaryReturn => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<HealthSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const fetchEntries = async (filters: DiaryFilters = {}) => {
    if (!patientId) {
      setError('Patient ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const params = new URLSearchParams();
      if (filters.startDate) params.append('start_date', filters.startDate);
      if (filters.endDate) params.append('end_date', filters.endDate);
      if (filters.mood) params.append('mood', filters.mood);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());

      const queryString = params.toString();
      const url = queryString 
        ? `${API_BASE_URL}${API_ENDPOINTS.healthDiary.doctorPatientEntries(patientId)}?${queryString}`
        : `${API_BASE_URL}${API_ENDPOINTS.healthDiary.doctorPatientEntries(patientId)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access denied. Doctor role required.');
        }
        if (response.status === 404) {
          throw new Error('No health diary entries found for this patient');
        }
        throw new Error(`Failed to fetch health diary: ${response.statusText}`);
      }

      const result: DiaryListResponse = await response.json();
      setEntries(result.entries || []);
      setTotalCount(result.total_count || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load health diary';
      setError(errorMessage);
      console.error('Error fetching health diary:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    if (!patientId) {
      return;
    }

    try {
      setLoadingSummary(true);

      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.healthDiary.doctorPatientSummary(patientId)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch health summary: ${response.statusText}`);
      }

      const result: HealthSummary = await response.json();
      setSummary(result);
    } catch (err) {
      console.error('Error fetching health summary:', err);
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [patientId]);

  const refetch = (filters?: DiaryFilters) => {
    fetchEntries(filters);
  };

  return { 
    entries, 
    totalCount, 
    loading, 
    error, 
    summary, 
    loadingSummary, 
    refetch,
    fetchSummary 
  };
};
