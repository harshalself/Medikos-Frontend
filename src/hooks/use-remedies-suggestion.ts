import { useState } from 'react';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/api-config';
import { useToast } from '@/hooks/use-toast';

export interface RemediesSuggestion {
  status: string;
  message?: string;
  disease: string;
  symptoms: string;
  natural_remedies: string;
  diet_suggestions: string;
  match_score: number;
  confidence_level: 'LOW' | 'MEDIUM' | 'HIGH';
  processing_time_ms: number;
}

export interface SystemHealth {
  status: string;
  version: string;
  dataset_records: number;
  last_updated: string;
  ml_model_loaded: boolean;
  approach: string;
}

export interface PopularDisease {
  disease: string;
  search_count: number;
  success_rate: number;
}

export interface SystemStats {
  status: string;
  total_searches: number;
  unique_users: number;
  average_response_time: number;
  popular_diseases: PopularDisease[];
  system_health: SystemHealth;
}

export const useRemediesSuggestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get remedies suggestions
  const suggestRemedies = async (symptoms: string): Promise<RemediesSuggestion | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<RemediesSuggestion>(
        API_ENDPOINTS.remediesSuggestion.suggest,
        { symptoms: symptoms.trim() }
      );

      return response;
    } catch (err: any) {
      let errorMessage = 'Failed to get remedies suggestions';

      if (err.data?.detail) {
        if (Array.isArray(err.data.detail)) {
          errorMessage = err.data.detail.map((error: any) =>
            typeof error === 'string' ? error : error.msg || 'Validation error'
          ).join(', ');
        } else {
          errorMessage = err.data.detail;
        }
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      }

      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    suggestRemedies,
    loading,
    error,
    clearError: () => setError(null)
  };
};