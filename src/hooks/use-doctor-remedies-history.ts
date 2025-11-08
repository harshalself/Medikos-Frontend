import { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';

interface RemediesSearch {
  id: string;
  user_id: string;
  search_query: string;
  search_type: string;
  results_count: number;
  response_time_ms: number;
  created_at: string;
}

interface SearchPatterns {
  fever_related?: number;
  pain_related?: number;
  digestive?: number;
  respiratory?: number;
  [key: string]: number | undefined;
}

interface RecommendationsSummary {
  total_searches: number;
  date_range: {
    oldest: string;
    newest: string;
  };
  common_symptoms_count: number;
  search_patterns: SearchPatterns;
}

interface RemediesHistoryResponse {
  status: string;
  user_id: string;
  total_searches: number;
  searches: RemediesSearch[];
  last_search_date: string;
  common_symptoms: string[];
  recommendations_summary: RecommendationsSummary;
}

interface UseRemediesHistoryReturn {
  data: RemediesHistoryResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDoctorRemediesHistory = (userId: string | undefined): UseRemediesHistoryReturn => {
  const [data, setData] = useState<RemediesHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRemediesHistory = async () => {
    if (!userId) {
      setError('User ID is required');
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

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.remediesSuggestion.doctorUserSearches(userId)}`,
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
        if (response.status === 404) {
          throw new Error('No remedies search history found for this user');
        }
        throw new Error(`Failed to fetch remedies history: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load remedies history';
      setError(errorMessage);
      console.error('Error fetching remedies history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemediesHistory();
  }, [userId]);

  const refetch = () => {
    fetchRemediesHistory();
  };

  return { data, loading, error, refetch };
};
