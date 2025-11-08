import { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';

interface HealthPassportData {
  basic_info?: {
    full_name: string;
    date_of_birth: string;
    blood_group: string;
    gender: string;
    age?: number;
  };
  medical_history?: {
    allergies: string[];
    chronic_conditions: string[];
    medications: string[];
    surgeries: string[];
  };
  vitals?: {
    height?: number;
    weight?: number;
    blood_pressure?: string;
    heart_rate?: number;
    bmi?: number;
  };
  lifestyle?: {
    smoking: boolean;
    alcohol: boolean;
    exercise_frequency?: string;
    diet_preference?: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  emergency_contact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
}

interface UseHealthPassportReturn {
  data: HealthPassportData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDoctorPatientHealthPassport = (patientId: string | undefined): UseHealthPassportReturn => {
  const [data, setData] = useState<HealthPassportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthPassport = async () => {
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

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.healthPassport.viewPatient(parseInt(patientId))}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Patient health passport not found');
        }
        throw new Error(`Failed to fetch health passport: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load health passport';
      setError(errorMessage);
      console.error('Error fetching health passport:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthPassport();
  }, [patientId]);

  const refetch = () => {
    fetchHealthPassport();
  };

  return { data, loading, error, refetch };
};
