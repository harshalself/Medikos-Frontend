# Remedies Suggestion API Documentation

## Overview

The Remedies Suggestion module provides AI-powered natural remedies and diet recommendations based on user symptoms. It uses machine learning to match symptoms with traditional remedies and dietary suggestions from an Indian diseases dataset.

## Features

- **Symptom-Based Matching**: AI-powered matching of user symptoms to diseases
- **Natural Remedies**: Traditional and natural remedy suggestions
- **Diet Recommendations**: Personalized diet suggestions for health conditions
- **Confidence Scoring**: Match confidence levels (LOW/MEDIUM/HIGH)
- **Anonymous & Authenticated Access**: Works for both logged-in and anonymous users
- **Search Analytics**: Tracks usage patterns for authenticated users

## Authentication & Authorization

### Access Levels
- **Anonymous Users**: Can get remedies suggestions without authentication
- **Authenticated Users**: Get personalized suggestions with search analytics tracking

### Authentication (Optional)
While authentication is not required, providing a JWT token enables:
- Search analytics and usage tracking
- Personalized recommendations
- Better user experience

## API Endpoints

### Base URL
```
http://localhost:8000/api/remedies-suggestion
```

---

## Remedies Suggestion

### 1. Get Remedies Suggestions
**Endpoint:** `POST /remedies-suggestion/suggest`  
**Access:** Anonymous or Authenticated  
**Description:** Get natural remedies and diet suggestions based on symptoms

**Request Body:**
```json
{
  "symptoms": "fever, headache, body pain"
}
```

**Request Validation:**
- `symptoms`: Required, 3-1000 characters
- Cannot be empty or whitespace-only

**Response (200 OK):**
```json
{
  "status": "success",
  "disease": "Non-specific Viral Fever",
  "symptoms": "Fever, headache, body ache, fatigue",
  "natural_remedies": "Drink plenty of fluids, take rest, use cold compresses, consume ginger tea",
  "diet_suggestions": "Light diet with fruits, vegetables, soups, avoid heavy and oily foods",
  "match_score": 0.5105,
  "confidence_level": "MEDIUM",
  "processing_time_ms": 45
}
```

---

## Doctor Access Endpoints

### 2. Get User Search History (Doctor Only)
**Endpoint:** `GET /remedies-suggestion/doctor/user-searches/{user_id}`  
**Access:** DOCTOR only  
**Description:** Get search history and recommendations for a specific user

**URL Parameters:**
- `user_id`: UUID of the user whose search history to retrieve

**Authentication:** Required (Doctor JWT token)

**Response (200 OK):**
```json
{
  "status": "success",
  "user_id": "d57e4c43-5f77-47a7-ac60-dcf2e15288ad",
  "total_searches": 5,
  "searches": [
    {
      "id": "uuid-string",
      "user_id": "d57e4c43-5f77-47a7-ac60-dcf2e15288ad",
      "search_query": "fever, headache, body pain",
      "search_type": "REMEDIES",
      "results_count": 1,
      "response_time_ms": 45,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "last_search_date": "2024-01-15T10:30:00Z",
  "common_symptoms": ["fever", "headache", "body pain", "cough"],
  "recommendations_summary": {
    "total_searches": 5,
    "date_range": {
      "oldest": "2024-01-10T08:15:00Z",
      "newest": "2024-01-15T10:30:00Z"
    },
    "common_symptoms_count": 4,
    "search_patterns": {
      "fever_related": 3,
      "pain_related": 2,
      "digestive": 1,
      "respiratory": 2
    }
  }
}
```

**Error Response (403 Forbidden) for non-doctors:**
```json
{
  "detail": "Insufficient permissions"
}
```

---

## Response Fields

### RemediesSuggestionResponse
- `status`: Always "success" for successful responses
- `disease`: Matched disease name from the dataset
- `symptoms`: Symptoms associated with the matched disease
- `natural_remedies`: Traditional/natural remedies for the condition
- `diet_suggestions`: Dietary recommendations for recovery
- `match_score`: Similarity score between input and matched disease (0.0-1.0)
- `confidence_level`: Confidence level based on match score
  - `LOW`: < 0.5
  - `MEDIUM`: 0.5-0.8
  - `HIGH`: > 0.8
- `processing_time_ms`: Time taken to process the request in milliseconds

---

## Error Responses

### Common Error Codes
- **400 Bad Request**: Invalid symptoms (empty, too short, too long)
- **422 Unprocessable Entity**: Request validation failed
- **500 Internal Server Error**: ML model or processing error

### Error Response Format
```json
{
  "detail": "Error message description"
}
```

### Specific Error Examples

**Empty Symptoms:**
```json
{
  "detail": "Symptoms cannot be empty"
}
```

**Symptoms Too Short:**
```json
{
  "detail": "Symptoms must be at least 3 characters long"
}
```

---

## Machine Learning Model

### Technology Stack
- **Algorithm**: TF-IDF Vectorization + Cosine Similarity
- **Dataset**: Indian diseases with traditional remedies
- **Processing**: Real-time symptom matching
- **Performance**: Sub-100ms response times

### How It Works
1. User submits symptoms as text
2. Symptoms are vectorized using TF-IDF
3. Cosine similarity calculated against disease database
4. Best matching disease returned with remedies
5. Confidence score calculated based on similarity

---

## Usage Examples

### Anonymous Request
```bash
curl -X POST "http://localhost:8000/api/remedies-suggestion/suggest" \
  -H "Content-Type: application/json" \
  -d '{"symptoms": "fever, headache, body pain"}'
```

### Authenticated Request
```bash
curl -X POST "http://localhost:8000/api/remedies-suggestion/suggest" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"symptoms": "cough, sore throat, runny nose"}'
```

### Doctor Access User Search History
```bash
curl -X GET "http://localhost:8000/api/remedies-suggestion/doctor/user-searches/USER_ID_HERE" \
  -H "Authorization: Bearer DOCTOR_JWT_TOKEN"
```

### Python Example
```python
import requests

response = requests.post(
    "http://localhost:8000/api/remedies-suggestion/suggest",
    json={"symptoms": "stomach pain, nausea, vomiting"}
)

if response.status_code == 200:
    data = response.json()
    print(f"Disease: {data['disease']}")
    print(f"Remedies: {data['natural_remedies']}")
    print(f"Diet: {data['diet_suggestions']}")
    print(f"Confidence: {data['confidence_level']}")
```

---

## Testing

Run the comprehensive test suite:

```bash
python scripts/test_remedies_suggestion_apis.py
```

The test suite covers:
- Anonymous remedies suggestions with multiple test cases
- User registration and authentication
- Authenticated remedies suggestions
- Doctor registration and authentication
- Doctor access to user search history
- Patient access control (cannot access doctor endpoints)
- Response validation and error handling

---

## Data Models

### RemediesSuggestionRequest
```json
{
  "symptoms": "string (3-1000 chars, required)"
}
```

### RemediesSuggestionResponse
```json
{
  "status": "string",
  "disease": "string",
  "symptoms": "string",
  "natural_remedies": "string",
  "diet_suggestions": "string",
  "match_score": "number (0.0-1.0)",
  "confidence_level": "LOW|MEDIUM|HIGH",
  "processing_time_ms": "integer"
}
```

### UserSearchHistoryResponse (Doctor Access)
```json
{
  "status": "string",
  "user_id": "string (UUID)",
  "total_searches": "integer",
  "searches": "Array<SearchHistoryItem>",
  "last_search_date": "string (ISO datetime)|null",
  "common_symptoms": "Array<string>",
  "recommendations_summary": {
    "total_searches": "integer",
    "date_range": {
      "oldest": "string (ISO datetime)|null",
      "newest": "string (ISO datetime)|null"
    },
    "common_symptoms_count": "integer",
    "search_patterns": {
      "fever_related": "integer",
      "pain_related": "integer",
      "digestive": "integer",
      "respiratory": "integer"
    }
  }
}
```

---

## Security Considerations

- **Input Validation**: Symptoms are validated for length and content
- **Rate Limiting**: Anonymous requests are rate-limited to prevent abuse
- **Optional Authentication**: Works for both logged-in and anonymous users
- **Doctor Access Control**: Only doctors can access user search history
- **User Data Privacy**: Search analytics only tracked for authenticated users
- **Role-Based Access**: Doctor endpoints require DOCTOR role verification
- **Data Isolation**: Users can only see their own data through doctor access

---

## Performance

- **Response Time**: Typically 20-100ms for symptom matching
- **Throughput**: Handles multiple concurrent requests
- **Scalability**: ML model loads once at startup
- **Memory Usage**: Efficient vectorization and similarity calculation

---

## Limitations

- **Dataset Scope**: Limited to diseases in the Indian traditional medicine dataset
- **Language**: Currently supports English symptom descriptions
- **Accuracy**: AI matching may not be 100% accurate - consult healthcare professionals
- **Medical Disclaimer**: Suggestions are for informational purposes only, not medical advice

---

## Future Enhancements

- Multi-language support for symptoms
- Expanded disease database
- More sophisticated ML models (BERT, etc.)
- Integration with medical APIs
- Personalized remedy tracking
- User feedback on remedy effectiveness