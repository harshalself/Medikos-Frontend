# Medikos Backend - Health Passport API Integration Guide

## Essential Details for Frontend Integration

### 1. Base URL
```
http://localhost:8000/api
```

### 2. API Endpoints

#### Core CRUD Operations
- `POST /health-passport` - Create new health passport
- `GET /health-passport` - Get user's health passport
- `PUT /health-passport` - Update entire health passport
- `DELETE /health-passport` - Delete health passport

#### Partial Update Operations
- `PATCH /health-passport/basic` - Update basic health info only
- `PATCH /health-passport/medical` - Update medical history only
- `PATCH /health-passport/vitals` - Update vital signs only
- `PATCH /health-passport/lifestyle` - Update lifestyle info only
- `PATCH /health-passport/address` - Update address info only
- `PATCH /health-passport/emergency` - Update emergency contact only

#### Utility Endpoints
- `GET /health-passport/exists` - Check if health passport exists

### 3. Request Format
**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <access_token>` (all routes require authentication)

### 4. Data Models

#### Health Passport Fields
```json
{
  // Basic Health Information
  "blood_group": "A+ | A- | B+ | B- | AB+ | AB- | O+ | O-",
  "allergies": "Peanuts, Shellfish, etc.",
  "chronic_conditions": "Diabetes, Hypertension, etc.",
  "current_medications": "Metformin 500mg, Lisinopril 10mg, etc.",
  "past_surgeries": "Appendectomy (2020), Knee Surgery (2018), etc.",
  "family_history": "Heart disease, Cancer, etc.",

  // Lifestyle Information
  "smoking_status": "Never | Former | Current",
  "alcohol_consumption": "None | Occasional | Moderate | Heavy",
  "exercise_frequency": "Sedentary | Light | Moderate | Active | Very Active",
  "diet_type": "Vegetarian | Vegan | Non-Vegetarian | Keto | etc.",

  // Vital Signs
  "height_cm": 175.5,
  "weight_kg": 70.2,
  "blood_pressure": "120/80",
  "heart_rate": 72,

  // Vaccination Records
  "vaccination_status": "Up to date | Partially vaccinated | Not vaccinated",

  // Address Details
  "address_line1": "123 Main Street",
  "address_line2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "postal_code": "10001",

  // Emergency Contact
  "emergency_contact_name": "Jane Doe",
  "emergency_contact_phone": "+1234567890",
  "emergency_contact_relation": "Sister"
}
```

### 5. Request/Response Examples

#### Create Health Passport
```http
POST /health-passport
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "blood_group": "A+",
  "allergies": "Peanuts",
  "chronic_conditions": "None",
  "height_cm": 175.5,
  "weight_kg": 70.2,
  "blood_pressure": "120/80",
  "emergency_contact_name": "Jane Doe",
  "emergency_contact_phone": "+1234567890",
  "emergency_contact_relation": "Sister"
}
```

**Response (201):**
```json
{
  "id": "uuid-string",
  "user_id": "user-uuid",
  "blood_group": "A+",
  "allergies": "Peanuts",
  "chronic_conditions": "None",
  "height_cm": 175.5,
  "weight_kg": 70.2,
  "blood_pressure": "120/80",
  "bmi": 22.8,
  "emergency_contact_name": "Jane Doe",
  "emergency_contact_phone": "+1234567890",
  "emergency_contact_relation": "Sister",
  "created_at": "2025-10-16T10:30:00Z",
  "updated_at": "2025-10-16T10:30:00Z"
}
```

#### Get Health Passport
```http
GET /health-passport
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": "uuid-string",
  "user_id": "user-uuid",
  "blood_group": "A+",
  "allergies": "Peanuts",
  "chronic_conditions": "None",
  "current_medications": "Metformin 500mg",
  "height_cm": 175.5,
  "weight_kg": 70.2,
  "blood_pressure": "120/80",
  "heart_rate": 72,
  "bmi": 22.8,
  "smoking_status": "Never",
  "alcohol_consumption": "Occasional",
  "exercise_frequency": "Moderate",
  "address_line1": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "postal_code": "10001",
  "emergency_contact_name": "Jane Doe",
  "emergency_contact_phone": "+1234567890",
  "emergency_contact_relation": "Sister",
  "created_at": "2025-10-16T10:30:00Z",
  "updated_at": "2025-10-16T10:30:00Z"
}
```

#### Update Basic Health Info Only
```http
PATCH /health-passport/basic
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "blood_group": "O+",
  "allergies": "Peanuts, Shellfish",
  "chronic_conditions": "Mild Hypertension"
}
```

**Response (200):**
```json
{
  "id": "uuid-string",
  "user_id": "user-uuid",
  "blood_group": "O+",
  "allergies": "Peanuts, Shellfish",
  "chronic_conditions": "Mild Hypertension",
  // ... other fields remain unchanged
  "updated_at": "2025-10-16T11:00:00Z"
}
```

#### Update Vital Signs Only
```http
PATCH /health-passport/vitals
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "height_cm": 176.0,
  "weight_kg": 69.5,
  "blood_pressure": "118/78",
  "heart_rate": 68
}
```

**Response (200):**
```json
{
  "id": "uuid-string",
  "user_id": "user-uuid",
  "height_cm": 176.0,
  "weight_kg": 69.5,
  "blood_pressure": "118/78",
  "heart_rate": 68,
  "bmi": 22.4,
  // ... other fields remain unchanged
  "updated_at": "2025-10-16T11:15:00Z"
}
```

#### Check if Health Passport Exists
```http
GET /health-passport/exists
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "exists": true,
  "user_id": "user-uuid"
}
```

### 6. Error Handling

#### Common Error Responses

**401 Unauthorized:**
```json
{
  "detail": "Not authenticated"
}
```

**404 Not Found (when health passport doesn't exist):**
```json
{
  "detail": "Health passport not found"
}
```

**400 Bad Request (validation errors):**
```json
{
  "detail": [
    {
      "loc": ["body", "blood_group"],
      "msg": "Invalid blood group. Must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-",
      "type": "value_error"
    }
  ]
}
```

**422 Unprocessable Entity (validation errors):**
```json
{
  "detail": [
    {
      "loc": ["body", "height_cm"],
      "msg": "Height must be between 50 and 300 cm",
      "type": "value_error"
    }
  ]
}
```

### 7. Frontend Integration Examples

#### React/JavaScript Integration
```javascript
// Create Health Passport
const createHealthPassport = async (healthData) => {
  try {
    const response = await fetch('http://localhost:8000/api/health-passport', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(healthData)
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating health passport:', error);
  }
};

// Get Health Passport
const getHealthPassport = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/health-passport', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching health passport:', error);
  }
};

// Update Specific Section
const updateVitals = async (vitalsData) => {
  try {
    const response = await fetch('http://localhost:8000/api/health-passport/vitals', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(vitalsData)
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating vitals:', error);
  }
};
```

#### TypeScript Integration
```typescript
interface HealthPassport {
  id: string;
  user_id: string;
  blood_group?: string;
  allergies?: string;
  chronic_conditions?: string;
  current_medications?: string;
  height_cm?: number;
  weight_kg?: number;
  blood_pressure?: string;
  heart_rate?: number;
  bmi?: number;
  smoking_status?: string;
  alcohol_consumption?: string;
  exercise_frequency?: string;
  address_line1?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
  created_at: string;
  updated_at: string;
}

interface VitalsUpdate {
  height_cm?: number;
  weight_kg?: number;
  blood_pressure?: string;
  heart_rate?: number;
}

// Usage
const updateVitals = async (vitals: VitalsUpdate): Promise<HealthPassport> => {
  const response = await fetch('http://localhost:8000/api/health-passport/vitals', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(vitals)
  });
  return response.json();
};
```

### 8. Validation Rules

#### Blood Group
- Valid values: `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`

#### Height
- Range: 50-300 cm
- Type: Float

#### Weight
- Range: 10-500 kg
- Type: Float

#### Heart Rate
- Range: 30-200 bpm
- Type: Integer

#### BMI Calculation
- Automatically calculated: `weight_kg / (height_cm/100)²`
- Read-only field in responses

### 9. Best Practices

#### 1. Progressive Data Collection
- Use partial updates to collect health data gradually
- Don't require all fields at once
- Allow users to update sections independently

#### 2. Data Validation
- Validate data on frontend before sending
- Handle validation errors gracefully
- Show specific error messages to users

#### 3. State Management
- Cache health passport data in frontend state
- Update local state after successful API calls
- Handle offline scenarios gracefully

#### 4. Privacy Considerations
- All health data is sensitive - ensure proper authentication
- Consider data encryption for highly sensitive fields
- Implement proper access controls

#### 5. Performance Optimization
- Use partial updates instead of full updates when possible
- Implement proper loading states
- Cache data to reduce API calls

### 10. Testing Checklist

- [ ] Create health passport with minimal data
- [ ] Create health passport with all fields
- [ ] Retrieve existing health passport
- [ ] Update entire health passport
- [ ] Update individual sections (basic, medical, vitals, etc.)
- [ ] Delete health passport
- [ ] Check existence endpoint
- [ ] Handle validation errors properly
- [ ] Handle authentication errors
- [ ] Handle not found errors
- [ ] Test BMI calculation
- [ ] Test with invalid data formats