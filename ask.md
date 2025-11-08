# Ask Endpoint API Documentation

## Overview
The `/ask` endpoint is part of the Healthcare API, providing a Retrieval-Augmented Generation (RAG) chatbot functionality for health-related queries. It processes user questions and returns relevant answers based on the loaded health data sources.

## Endpoint Details

### URL
```
POST /ask
```

### Content-Type
```
application/json
```

### Request Body
The request must include a JSON object with the following structure:

```json
{
  "query": "string"
}
```

#### Parameters
- `query` (string, required): The user's question or query about health-related topics. Cannot be empty or whitespace-only.

#### Example Request
```json
{
  "query": "What are the symptoms of diabetes?"
}
```

### Response

#### Success Response (200 OK)
Returns a JSON object with the following structure:

```json
{
  "query": "string",
  "answer": "string",
  "suggestions": ["string", "string", "string"]
}
```

#### Response Fields
- `query` (string): The original query submitted by the user.
- `answer` (string): The generated answer based on the health data sources.
- `suggestions` (array of strings): Up to 3 suggested follow-up questions related to the query.

#### Example Success Response
```json
{
  "query": "What are the symptoms of diabetes?",
  "answer": "Diabetes symptoms include frequent urination, excessive thirst, unexplained weight loss, increased hunger, fatigue, slow-healing sores, frequent infections, blurred vision, and tingling or numbness in hands or feet.",
  "suggestions": [
    "How is diabetes diagnosed?",
    "What are the treatment options for diabetes?",
    "Can diabetes be prevented?"
  ]
}
```

### Error Responses

#### 400 Bad Request
Returned when the query is empty or contains only whitespace.

```json
{
  "detail": "Query cannot be empty"
}
```

#### 500 Internal Server Error
Returned when an unexpected error occurs during processing.

```json
{
  "detail": "Error description"
}
```

## Frontend Integration

### JavaScript/Fetch API Example
```javascript
const askQuestion = async (query) => {
  try {
    const response = await fetch('/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error asking question:', error);
    throw error;
  }
};

// Usage
askQuestion("What are the symptoms of diabetes?")
  .then(data => {
    console.log('Answer:', data.answer);
    console.log('Suggestions:', data.suggestions);
  })
  .catch(error => {
    console.error('Failed to get answer:', error);
  });
```

### React Hook Example
```javascript
import { useState } from 'react';

const useAskEndpoint = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const askQuestion = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { askQuestion, loading, error };
};

// Usage in component
const ChatComponent = () => {
  const { askQuestion, loading, error } = useAskEndpoint();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await askQuestion(query);
      setResponse(data);
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a health question..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </form>
      {error && <p>Error: {error}</p>}
      {response && (
        <div>
          <h3>Answer:</h3>
          <p>{response.answer}</p>
          <h4>Suggested follow-ups:</h4>
          <ul>
            {response.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
```

## Notes
- The API uses FastAPI with Pydantic for request/response validation.
- Answers are generated using a RAG system with vector search on health data.
- Suggestions are AI-generated follow-up questions related to the query.
- Ensure the backend server is running on the appropriate port (default FastAPI port is 8002).