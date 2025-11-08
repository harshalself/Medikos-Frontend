import { useState } from 'react';

// Hardcoded port 8002 for the disease prediction API
const PREDICT_API_BASE_URL = 'http://localhost:8002';

interface SymptomImportance {
  [symptom: string]: number;
}

interface PredictResponse {
  prediction: string;
  symptom_importance: SymptomImportance;
}

interface PredictErrorResponse {
  error: string;
}

interface UsePredictDiseaseReturn {
  predictDisease: (symptoms: string[]) => Promise<PredictResponse>;
  loading: boolean;
  error: string | null;
}

export const usePredictDisease = (): UsePredictDiseaseReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predictDisease = async (symptoms: string[]): Promise<PredictResponse> => {
    if (!symptoms || symptoms.length === 0) {
      throw new Error('Please add at least one symptom');
    }

    setLoading(true);
    setError(null);

    console.log('Sending symptoms to prediction API:', symptoms);
    console.log('Request body:', JSON.stringify({ symptoms }));

    try {
      const requestBody = { symptoms };
      console.log('Final request body:', requestBody);
      
      const response = await fetch(`${PREDICT_API_BASE_URL}/predict_with_shap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response body:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data: PredictResponse | PredictErrorResponse = await response.json();
      console.log('Successful response data:', data);

      // Check if the API returned an error message
      if ('error' in data) {
        throw new Error(data.error);
      }

      return data as PredictResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to predict disease';
      setError(errorMessage);
      console.error('Error predicting disease:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { predictDisease, loading, error };
};
