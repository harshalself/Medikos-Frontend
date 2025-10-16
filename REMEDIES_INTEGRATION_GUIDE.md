# Medikos Backend - Remedies Suggestion API Integration Guide

## Essential Details for Frontend Integration

### 1. Base URL
```
http://localhost:8000/api
```

### 2. API Endpoints

#### Core Functionality
- `POST /remedies-suggestion/suggest` - Get natural remedies and diet suggestions based on symptoms
- `POST /remedies-suggestion/record-selection` - Record user remedy selection (authenticated)

#### System Information
- `GET /remedies-suggestion/health` - Get system health and dataset info
- `GET /remedies-suggestion/stats` - Get system statistics and usage metrics

### 3. Authentication Requirements
- **Optional Authentication**: Core suggestion endpoint works without login
- **Required for Selection Tracking**: `record-selection` endpoint requires authentication
- **Enhanced Analytics**: Authenticated users get personalized tracking and analytics

### 4. Data Source & Algorithm
The system uses an Indian diseases dataset with traditional remedies:
- **Dataset**: 100+ common Indian diseases with symptoms, remedies, and diet suggestions
- **Algorithm**: TF-IDF (Term Frequency-Inverse Document Frequency) with cosine similarity
- **Matching**: Intelligent symptom-to-disease matching with confidence scoring
- **Traditional Wisdom**: Ayurveda-inspired natural remedies and dietary recommendations

## Request/Response Examples

### Get Remedies Suggestions

```http
POST /remedies-suggestion/suggest
Content-Type: application/json
Authorization: Bearer <optional_access_token>

{
  "symptoms": "frequent urination, excessive thirst, fatigue, blurred vision"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Remedies found for Diabetes Type 2",
  "disease": "Diabetes Type 2",
  "symptoms": "Frequent urination, excessive thirst, fatigue, blurred vision, slow healing wounds, increased hunger, weight loss",
  "natural_remedies": "Bitter gourd juice, fenugreek seeds soaked overnight, cinnamon tea, neem leaves, regular exercise, yoga, meditation",
  "diet_suggestions": "Eat: whole grains, leafy vegetables, bitter gourd, fenugreek, nuts, fish | Avoid: refined sugar, white rice, processed foods, sugary drinks",
  "match_score": 0.87,
  "confidence_level": "HIGH",
  "processing_time_ms": 145
}
```

### Record User Selection (Authenticated)

```http
POST /remedies-suggestion/record-selection
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "search_id": 1,
  "suggestion_id": 2
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Selection recorded successfully",
  "selection_recorded": true,
  "timestamp": "2025-10-17T10:30:00Z"
}
```

### System Health Check

```http
GET /remedies-suggestion/health
```

**Response (200):**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "dataset_records": 125,
  "last_updated": "2025-10-17T10:00:00Z",
  "ml_model_loaded": true,
  "approach": "tfidf_cosine_similarity"
}
```

### System Statistics

```http
GET /remedies-suggestion/stats
```

**Response (200):**
```json
{
  "status": "success",
  "total_searches": 1250,
  "unique_users": 340,
  "average_response_time": 142.5,
  "popular_diseases": [
    {
      "disease": "Diabetes Type 2",
      "search_count": 145,
      "success_rate": 0.92
    },
    {
      "disease": "Hypertension",
      "search_count": 98,
      "success_rate": 0.89
    }
  ],
  "system_health": {
    "status": "healthy",
    "version": "1.0.0",
    "dataset_records": 125,
    "last_updated": "2025-10-17T10:00:00Z",
    "ml_model_loaded": true,
    "approach": "tfidf_cosine_similarity"
  }
}
```

## Frontend Integration Examples

### React/JavaScript Integration

```javascript
// Remedies Suggestion Hook
import { useState } from 'react';

const useRemediesSuggestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get remedies suggestions
  const suggestRemedies = async (symptoms, accessToken = null) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/remedies-suggestion/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken}` })
        },
        body: JSON.stringify({
          symptoms: symptoms
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to get remedies');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Record user selection (requires authentication)
  const recordSelection = async (searchId, suggestionId, accessToken) => {
    try {
      const response = await fetch('http://localhost:8000/api/remedies-suggestion/record-selection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          search_id: searchId,
          suggestion_id: suggestionId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to record selection');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Get system health
  const getSystemHealth = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/remedies-suggestion/health');
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to get system health');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    suggestRemedies,
    recordSelection,
    getSystemHealth,
    loading,
    error
  };
};

// Usage in Component
const RemediesComponent = () => {
  const [symptoms, setSymptoms] = useState('');
  const [remedies, setRemedies] = useState(null);
  const { suggestRemedies, recordSelection, loading, error } = useRemediesSuggestion();

  const handleGetRemedies = async () => {
    try {
      const result = await suggestRemedies(symptoms);
      setRemedies(result);
    } catch (err) {
      console.error('Failed to get remedies:', err);
    }
  };

  const handleSelectRemedy = async (searchId, suggestionId) => {
    try {
      const accessToken = getAccessToken(); // Get from auth context
      await recordSelection(searchId, suggestionId, accessToken);
      console.log('Selection recorded successfully');
    } catch (err) {
      console.error('Failed to record selection:', err);
    }
  };

  return (
    <div className="remedies-container">
      <h2>Natural Remedies Suggestion</h2>

      <div className="symptoms-input">
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe your symptoms (e.g., frequent urination, excessive thirst, fatigue)"
          rows={4}
        />
        <button onClick={handleGetRemedies} disabled={loading || !symptoms.trim()}>
          {loading ? 'Getting Remedies...' : 'Get Natural Remedies'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {remedies && (
        <div className="remedies-result">
          <div className="disease-info">
            <h3>Possible Condition: {remedies.disease}</h3>
            <div className="confidence">
              <span className={`confidence-level ${remedies.confidence_level.toLowerCase()}`}>
                Confidence: {remedies.confidence_level} ({Math.round(remedies.match_score * 100)}%)
              </span>
            </div>
          </div>

          <div className="remedies-section">
            <h4>🌿 Natural Remedies</h4>
            <p>{remedies.natural_remedies}</p>
          </div>

          <div className="diet-section">
            <h4>🥗 Diet Suggestions</h4>
            <p>{remedies.diet_suggestions}</p>
          </div>

          <div className="actions">
            <button onClick={() => handleSelectRemedy(remedies.id, 1)}>
              Try These Remedies
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
```

### TypeScript Integration

```typescript
// Types
interface RemediesSuggestion {
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

interface SystemHealth {
  status: string;
  version: string;
  dataset_records: number;
  last_updated: string;
  ml_model_loaded: boolean;
  approach: string;
}

interface PopularDisease {
  disease: string;
  search_count: number;
  success_rate: number;
}

interface SystemStats {
  status: string;
  total_searches: number;
  unique_users: number;
  average_response_time: number;
  popular_diseases: PopularDisease[];
  system_health: SystemHealth;
}

// Service class
class RemediesSuggestionService {
  private baseUrl = 'http://localhost:8000/api';

  async suggestRemedies(
    symptoms: string,
    accessToken?: string
  ): Promise<RemediesSuggestion> {
    const response = await fetch(`${this.baseUrl}/remedies-suggestion/suggest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` })
      },
      body: JSON.stringify({
        symptoms: symptoms.trim()
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async recordSelection(
    searchId: number,
    suggestionId: number,
    accessToken: string
  ): Promise<{ status: string; message: string; selection_recorded: boolean }> {
    const response = await fetch(`${this.baseUrl}/remedies-suggestion/record-selection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        search_id: searchId,
        suggestion_id: suggestionId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getSystemHealth(): Promise<SystemHealth> {
    const response = await fetch(`${this.baseUrl}/remedies-suggestion/health`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getSystemStats(): Promise<SystemStats> {
    const response = await fetch(`${this.baseUrl}/remedies-suggestion/stats`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

// React Hook with TypeScript
const useRemediesSuggestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = new RemediesSuggestionService();

  const suggestRemedies = async (
    symptoms: string,
    accessToken?: string
  ): Promise<RemediesSuggestion> => {
    setLoading(true);
    setError(null);

    try {
      return await service.suggestRemedies(symptoms, accessToken);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const recordSelection = async (
    searchId: number,
    suggestionId: number,
    accessToken: string
  ) => {
    try {
      return await service.recordSelection(searchId, suggestionId, accessToken);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  };

  const getSystemHealth = async (): Promise<SystemHealth> => {
    try {
      return await service.getSystemHealth();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    suggestRemedies,
    recordSelection,
    getSystemHealth,
    loading,
    error
  };
};
```

## Error Handling

### Common Error Responses

**400 Bad Request (Validation Error):**
```json
{
  "detail": [
    {
      "loc": ["body", "symptoms"],
      "msg": "Symptoms cannot be empty",
      "type": "value_error"
    }
  ]
}
```

**401 Unauthorized (Missing/Incorrect Token for Selection):**
```json
{
  "detail": "Not authenticated"
}
```

**404 Not Found (No Matching Disease):**
```json
{
  "status": "error",
  "message": "No matching remedies found for the given symptoms",
  "match_score": 0.0,
  "confidence_level": "LOW"
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Internal server error: ML model not loaded"
}
```

## Best Practices

### 1. Input Optimization
- **Symptom Formatting**: Encourage users to describe symptoms clearly and comprehensively
- **Minimum Length**: Respect the 3-character minimum for symptoms input
- **Natural Language**: Support natural language descriptions of symptoms

### 2. User Experience
- **Progressive Disclosure**: Show confidence levels and match scores to set expectations
- **Cultural Context**: Highlight that remedies are based on traditional Indian medicine
- **Disclaimer**: Include medical disclaimers that suggestions are not substitutes for professional medical advice

### 3. Data Presentation
- **Confidence Indicators**: Use visual indicators for HIGH/MEDIUM/LOW confidence levels
- **Remedies Formatting**: Parse and display remedies as structured lists when possible
- **Diet Categories**: Separate "Eat" and "Avoid" sections clearly

### 4. Authentication Integration
- **Optional Auth**: Core functionality works without login
- **Enhanced Tracking**: Selection tracking requires authentication
- **Personalization**: Future features may include personalized remedy history

### 5. Performance Considerations
- **Response Time Monitoring**: Use `processing_time_ms` for performance tracking
- **Caching Strategy**: Cache common symptom patterns and their remedies
- **Batch Processing**: Consider batching multiple symptom checks

### 6. Medical Disclaimer Integration
Always include appropriate medical disclaimers:
```javascript
const MEDICAL_DISCLAIMER = `
⚠️ Medical Disclaimer:
This information is for educational purposes only and is not a substitute for professional medical advice.
Always consult with a qualified healthcare provider before starting any new treatment or remedy.
Natural remedies may interact with medications or have contraindications.
`;

// Display disclaimer prominently in UI
<div className="medical-disclaimer">
  <p>{MEDICAL_DISCLAIMER}</p>
</div>
```

## Testing Checklist

- [ ] Submit symptoms and get remedies suggestions
- [ ] Test with various symptom descriptions (headache, fever, cough, etc.)
- [ ] Handle cases with no matching diseases
- [ ] Record user selections (authenticated)
- [ ] Handle authentication errors gracefully
- [ ] Test system health endpoint
- [ ] Verify confidence levels and match scores
- [ ] Test with edge cases (very short symptoms, special characters)
- [ ] Validate response time performance
- [ ] Test with and without authentication
- [ ] Verify error handling for invalid inputs
- [ ] Check medical disclaimer integration
- [ ] Test various diseases (Diabetes, Hypertension, Asthma, etc.)
- [ ] Validate remedies and diet suggestions formatting