import { useState } from 'react';

// Hardcoded port 8002 for the RAG chatbot API
const CHATBOT_API_BASE_URL = 'http://localhost:8002';

interface AskResponse {
  query: string;
  answer: string;
  suggestions: string[];
}

interface UseAskChatbotReturn {
  askQuestion: (query: string) => Promise<AskResponse>;
  loading: boolean;
  error: string | null;
}

export const useAskChatbot = (): UseAskChatbotReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askQuestion = async (query: string): Promise<AskResponse> => {
    if (!query.trim()) {
      throw new Error('Query cannot be empty');
    }

    setLoading(true);
    setError(null);

    console.log('Sending query to chatbot API:', query);

    try {
      const response = await fetch(`${CHATBOT_API_BASE_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response body:', errorText);
        if (response.status === 400) {
          throw new Error('Query cannot be empty');
        }
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data: AskResponse = await response.json();
      console.log('Successful response data:', data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get answer';
      setError(errorMessage);
      console.error('Error asking question:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { askQuestion, loading, error };
};
