# Medikos Backend - Generic Medicine Suggester API Integration Guide

## Essential Details for Frontend Integration

### 1. Base URL
```
http://localhost:8000/api
```

### 2. API Endpoints

#### Core Functionality
- `POST /medicine-suggester/suggest-alternatives` - Get generic alternatives for branded medicine
- `GET /medicine-suggester/search-medicines` - Search for branded medicines
- `POST /medicine-suggester/record-selection` - Record user medicine selection (authenticated)

#### System Information
- `GET /medicine-suggester/health` - Get system health and data source info
- `GET /medicine-suggester/stats` - Get system statistics

### 3. Authentication Requirements
- **Optional Authentication**: Most endpoints work without login
- **Required for Selection Tracking**: `record-selection` endpoint requires authentication
- **User Data Tracking**: Authenticated users get personalized suggestions and selection tracking

### 4. Data Sources & Verification
The system uses government-verified medicine databases:
- **NLEM (National List of Essential Medicines)** - Official government list
- **Jan Aushadhi** - Government generic medicine initiative
- **Branded Medicine Database** - Comprehensive branded medicine catalog
- **All data is government-verified** for authenticity and reliability

## Request/Response Examples

### Get Generic Medicine Alternatives

```http
POST /medicine-suggester/suggest-alternatives
Content-Type: application/json
Authorization: Bearer <optional_access_token>

{
  "branded_medicine_name": "Crocin",
  "search_type": "SUGGESTION",
  "user_agent": "Mozilla/5.0...",
  "session_id": "session_123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Found 3 generic alternatives",
  "input": {
    "branded_name": "Crocin",
    "composition": "Paracetamol 500mg",
    "strength": "500mg",
    "dosage_form": "Tablet"
  },
  "alternatives": [
    {
      "id": 1,
      "generic_name": "Paracetamol",
      "drug_code": "NLEM001",
      "pack_size": "10 Tablets",
      "source": "NLEM",
      "match_type": "EXACT",
      "confidence_score": 95.5,
      "government_verified": true,
      "nlem_medicine": "Paracetamol 500mg Tablet",
      "user_selected": false,
      "selected_at": null
    },
    {
      "id": 2,
      "generic_name": "Acetaminophen",
      "drug_code": "JAN001",
      "pack_size": "100 Tablets",
      "source": "Jan Aushadhi",
      "match_type": "EXACT",
      "confidence_score": 90.2,
      "government_verified": true,
      "nlem_medicine": "Paracetamol 500mg Tablet",
      "user_selected": false,
      "selected_at": null
    }
  ],
  "metadata": {
    "total_found": 3,
    "search_method": "fuzzy_matching",
    "process_time_seconds": 0.123,
    "response_time_ms": 145.67,
    "cached": false
  }
}
```

### Search for Branded Medicines

```http
GET /medicine-suggester/search-medicines?search_term=crocin&search_type=SEARCH
Authorization: Bearer <optional_access_token>
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Found 5 matches",
  "search_term": "crocin",
  "matches": [
    {
      "id": 1,
      "name": "Crocin",
      "composition": "Paracetamol 500mg",
      "manufacturer": "GSK",
      "dosage_form": "Tablet",
      "strength": "500mg",
      "pack_size": "15 Tablets"
    },
    {
      "id": 2,
      "name": "Crocin Advance",
      "composition": "Paracetamol 650mg",
      "manufacturer": "GSK",
      "dosage_form": "Tablet",
      "strength": "650mg",
      "pack_size": "20 Tablets"
    }
  ],
  "total_found": 5,
  "metadata": {
    "search_method": "fuzzy_search",
    "response_time_ms": 89.34
  }
}
```

### Record User Selection (Authenticated)

```http
POST /medicine-suggester/record-selection
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
GET /medicine-suggester/health
```

**Response (200):**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "data_sources": {
    "nlem_medicines": 849,
    "jan_aushadhi_products": 1542,
    "branded_medicines": 12500
  },
  "government_verified": true,
  "approach": "rule_based_only",
  "last_updated": "2025-10-17T10:00:00Z",
  "uptime_seconds": 3600.5
}
```

## Frontend Integration Examples

### React/JavaScript Integration

```javascript
// Medicine Suggester Hook
import { useState, useEffect } from 'react';

const useMedicineSuggester = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get generic alternatives
  const suggestAlternatives = async (medicineName) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/medicine-suggester/suggest-alternatives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Optional: 'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          branded_medicine_name: medicineName,
          search_type: 'SUGGESTION'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to get suggestions');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Search medicines
  const searchMedicines = async (searchTerm) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/medicine-suggester/search-medicines?search_term=${encodeURIComponent(searchTerm)}&search_type=SEARCH`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Search failed');
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
      const response = await fetch('http://localhost:8000/api/medicine-suggester/record-selection', {
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

  return {
    suggestAlternatives,
    searchMedicines,
    recordSelection,
    loading,
    error
  };
};

// Usage in Component
const MedicineSearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { suggestAlternatives, searchMedicines, recordSelection, loading, error } = useMedicineSuggester();

  const handleSearch = async () => {
    try {
      const results = await searchMedicines(searchTerm);
      setSuggestions(results.matches);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleGetAlternatives = async (medicineName) => {
    try {
      const result = await suggestAlternatives(medicineName);
      console.log('Alternatives:', result.alternatives);
    } catch (err) {
      console.error('Failed to get alternatives:', err);
    }
  };

  const handleSelectAlternative = async (searchId, suggestionId) => {
    try {
      // Get access token from your auth context/store
      const accessToken = getAccessToken();
      await recordSelection(searchId, suggestionId, accessToken);
      console.log('Selection recorded successfully');
    } catch (err) {
      console.error('Failed to record selection:', err);
    }
  };

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for medicine..."
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <div className="error">{error}</div>}

      {suggestions.map(medicine => (
        <div key={medicine.id}>
          <h3>{medicine.name}</h3>
          <p>{medicine.composition}</p>
          <button onClick={() => handleGetAlternatives(medicine.name)}>
            Get Generic Alternatives
          </button>
        </div>
      ))}
    </div>
  );
};
```

### TypeScript Integration

```typescript
// Types
interface MedicineAlternative {
  id?: number;
  generic_name: string;
  drug_code?: string;
  pack_size?: string;
  source: string;
  match_type: 'EXACT' | 'FUZZY';
  confidence_score: number;
  government_verified: boolean;
  nlem_medicine?: string;
  user_selected: boolean;
  selected_at?: string;
}

interface SuggestionResponse {
  status: string;
  message?: string;
  input?: {
    branded_name: string;
    composition?: string;
    strength?: string;
    dosage_form?: string;
  };
  alternatives: MedicineAlternative[];
  metadata: {
    total_found: number;
    search_method: string;
    process_time_seconds: number;
    response_time_ms: number;
    cached: boolean;
  };
}

interface SearchResponse {
  status: string;
  message?: string;
  search_term: string;
  matches: Array<{
    id: number;
    name: string;
    composition?: string;
    manufacturer?: string;
    dosage_form?: string;
    strength?: string;
    pack_size?: string;
  }>;
  total_found: number;
  metadata?: Record<string, any>;
}

// Service class
class MedicineSuggesterService {
  private baseUrl = 'http://localhost:8000/api';

  async suggestAlternatives(
    medicineName: string,
    accessToken?: string
  ): Promise<SuggestionResponse> {
    const response = await fetch(`${this.baseUrl}/medicine-suggester/suggest-alternatives`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` })
      },
      body: JSON.stringify({
        branded_medicine_name: medicineName,
        search_type: 'SUGGESTION'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async searchMedicines(
    searchTerm: string,
    accessToken?: string
  ): Promise<SearchResponse> {
    const response = await fetch(
      `${this.baseUrl}/medicine-suggester/search-medicines?search_term=${encodeURIComponent(searchTerm)}&search_type=SEARCH`,
      {
        headers: {
          ...(accessToken && { Authorization: `Bearer ${accessToken}` })
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async recordSelection(
    searchId: number,
    suggestionId: number,
    accessToken: string
  ): Promise<{ status: string; message: string }> {
    const response = await fetch(`${this.baseUrl}/medicine-suggester/record-selection`, {
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getSystemHealth(): Promise<{
    status: string;
    version: string;
    data_sources: Record<string, number>;
    government_verified: boolean;
  }> {
    const response = await fetch(`${this.baseUrl}/medicine-suggester/health`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

// React Hook with TypeScript
const useMedicineSuggester = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = new MedicineSuggesterService();

  const suggestAlternatives = async (
    medicineName: string,
    accessToken?: string
  ): Promise<SuggestionResponse> => {
    setLoading(true);
    setError(null);

    try {
      return await service.suggestAlternatives(medicineName, accessToken);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchMedicines = async (
    searchTerm: string,
    accessToken?: string
  ): Promise<SearchResponse> => {
    setLoading(true);
    setError(null);

    try {
      return await service.searchMedicines(searchTerm, accessToken);
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

  return {
    suggestAlternatives,
    searchMedicines,
    recordSelection,
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
      "loc": ["body", "branded_medicine_name"],
      "msg": "Medicine name cannot be empty",
      "type": "value_error"
    }
  ]
}
```

**401 Unauthorized (Missing/Incorrect Token):**
```json
{
  "detail": "Not authenticated"
}
```

**404 Not Found (No Alternatives Found):**
```json
{
  "status": "success",
  "message": "No alternatives found",
  "alternatives": [],
  "metadata": {
    "total_found": 0,
    "search_method": "fuzzy_matching",
    "process_time_seconds": 0.089,
    "response_time_ms": 95.23,
    "cached": false
  }
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Internal server error: Database connection failed"
}
```

## Best Practices

### 1. Search Optimization
- **Debounce Search**: Implement debouncing for search inputs to avoid excessive API calls
- **Minimum Search Length**: Respect the 2-character minimum for search terms
- **Cache Results**: Cache search results locally to improve performance

### 2. User Experience
- **Loading States**: Always show loading indicators during API calls
- **Progressive Enhancement**: App works without authentication but offers more features when logged in
- **Offline Support**: Consider caching popular medicine searches

### 3. Data Handling
- **Government Verification**: Highlight government-verified alternatives prominently
- **Confidence Scores**: Use confidence scores to rank and display alternatives
- **Source Attribution**: Show data source (NLEM, Jan Aushadhi) for transparency

### 4. Authentication Integration
- **Optional Auth**: Core functionality works without login
- **Enhanced Features**: Selection tracking and personalization require authentication
- **Graceful Degradation**: Handle auth failures without breaking core functionality

### 5. Performance Considerations
- **Response Time Monitoring**: Use the `response_time_ms` field for performance monitoring
- **Caching Strategy**: Leverage the `cached` field to optimize repeated requests
- **Batch Operations**: Consider batching multiple medicine lookups when possible

## Testing Checklist

- [ ] Search for medicines with exact matches
- [ ] Search for medicines with partial/fuzzy matches
- [ ] Get generic alternatives for branded medicines
- [ ] Handle cases with no alternatives found
- [ ] Record user selections (authenticated)
- [ ] Handle authentication errors gracefully
- [ ] Test system health endpoint
- [ ] Verify government verification badges
- [ ] Test with various medicine names and compositions
- [ ] Validate confidence scores and ranking
- [ ] Test error handling for invalid inputs
- [ ] Verify response time performance
- [ ] Test with and without authentication
- [ ] Validate data source attribution