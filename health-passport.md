# Health Passport API Documentation

## Overview

The Health Passport module provides comprehensive health data management for users in the Medikos Backend system. It allows patients to create, manage, and update their personal health information, while also providing doctors with controlled access to patient health data.

## Features

- **Complete Health Profile Management**: Store comprehensive health information including basic info, medical history, vitals, lifestyle, address, and emergency contacts
- **Role-Based Access Control (RBAC)**: Patients can manage their own health passports, doctors can access patient health data
- **Partial Updates**: Update specific sections of health data without affecting other fields
- **Auto-calculated Metrics**: BMI is automatically calculated from height and weight
- **Doctor Access**: Doctors can view any patient's health passport for medical purposes

## Authentication & Authorization

### User Roles
- **PATIENT**: Can create, read, update, and delete their own health passport
- **DOCTOR**: Can read any patient's health passport, but cannot modify them

### Authentication
All endpoints require JWT authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### Base URL
```
http://localhost:8000/api/health-passport
```

---

## Core CRUD Operations

### 1. Create Health Passport
**Endpoint:** `POST /health-passport`  
**Access:** PATIENT, DOCTOR  
**Description:** Create a new health passport for the authenticated user

**Request Body:**
```json
{
  "blood_group": "A+",
  "allergies": "Peanuts, Shellfish",
  "height_cm": 175.5,
  "weight_kg": 70.0,
  "emergency_contact_name": "John Doe",
  "emergency_contact_phone": "+1234567890",
  "emergency_contact_relation": "Brother",
  "medical_conditions": "None",
  "current_medications": "None",
  "past_surgeries": "Appendectomy",
  "family_medical_history": "Heart disease",
  "smoking_status": "Never",
  "alcohol_consumption": "Occasional",
  "exercise_frequency": "3-4 times per week",
  "diet_type": "Balanced",
  "sleep_hours": 8,
  "stress_level": "Moderate",
  "street_address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "USA"
}
```

**Response (201 Created):**
```json
{
  "id": "4ba260a1-f80d-495e-a942-510d548bc17e",
  "user_id": "40b3ef75-8473-475e-9e73-cb769f1c45c5",
  "blood_group": "A+",
  "allergies": "Peanuts, Shellfish",
  "height_cm": 175.5,
  "weight_kg": 70.0,
  "bmi": 22.73,
  "emergency_contact_name": "John Doe",
  "emergency_contact_phone": "+1234567890",
  "emergency_contact_relation": "Brother",
  "medical_conditions": "None",
  "current_medications": "None",
  "past_surgeries": "Appendectomy",
  "family_medical_history": "Heart disease",
  "smoking_status": "Never",
  "alcohol_consumption": "Occasional",
  "exercise_frequency": "3-4 times per week",
  "diet_type": "Balanced",
  "sleep_hours": 8,
  "stress_level": "Moderate",
  "street_address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "USA",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### 2. Get Health Passport
**Endpoint:** `GET /health-passport`  
**Access:** PATIENT, DOCTOR  
**Description:** Retrieve the health passport for the authenticated user

**Response (200 OK):**
```json
{
  "id": "4ba260a1-f80d-495e-a942-510d548bc17e",
  "user_id": "40b3ef75-8473-475e-9e73-cb769f1c45c5",
  "blood_group": "A+",
  "allergies": "Peanuts, Shellfish",
  "height_cm": 175.5,
  "weight_kg": 70.0,
  "bmi": 22.73,
  "emergency_contact_name": "John Doe",
  "emergency_contact_phone": "+1234567890",
  "emergency_contact_relation": "Brother",
  "medical_conditions": "None",
  "current_medications": "None",
  "past_surgeries": "Appendectomy",
  "family_medical_history": "Heart disease",
  "smoking_status": "Never",
  "alcohol_consumption": "Occasional",
  "exercise_frequency": "3-4 times per week",
  "diet_type": "Balanced",
  "sleep_hours": 8,
  "stress_level": "Moderate",
  "street_address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "USA",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### 3. Update Health Passport
**Endpoint:** `PUT /health-passport`  
**Access:** PATIENT, DOCTOR  
**Description:** Update the entire health passport for the authenticated user

**Request Body:** Same as create request (all fields required)

**Response (200 OK):** Same as get response

---

### 4. Delete Health Passport
**Endpoint:** `DELETE /health-passport`  
**Access:** PATIENT, DOCTOR  
**Description:** Delete the health passport for the authenticated user

**Response (200 OK):**
```json
{
  "message": "Health passport deleted successfully"
}
```

---

## Partial Update Operations

### 5. Update Basic Info
**Endpoint:** `PATCH /health-passport/basic`  
**Access:** PATIENT, DOCTOR  
**Description:** Update basic health information only

**Request Body:**
```json
{
  "blood_group": "O-",
  "allergies": "Updated allergies"
}
```

**Response (200 OK):** Full health passport object with updated fields

---

### 6. Update Medical History
**Endpoint:** `PATCH /health-passport/medical`  
**Access:** PATIENT, DOCTOR  
**Description:** Update medical history only

**Request Body:**
```json
{
  "medical_conditions": "Hypertension",
  "current_medications": "Lisinopril 10mg",
  "past_surgeries": "Updated surgery history"
}
```

---

### 7. Update Vitals
**Endpoint:** `PATCH /health-passport/vitals`  
**Access:** PATIENT, DOCTOR  
**Description:** Update vital signs only (BMI auto-calculated)

**Request Body:**
```json
{
  "height_cm": 180.0,
  "weight_kg": 75.0
}
```

**Response:** BMI will be automatically recalculated and returned

---

### 8. Update Lifestyle
**Endpoint:** `PATCH /health-passport/lifestyle`  
**Access:** PATIENT, DOCTOR  
**Description:** Update lifestyle information only

**Request Body:**
```json
{
  "smoking_status": "Former",
  "alcohol_consumption": "None",
  "exercise_frequency": "Daily",
  "diet_type": "Vegetarian",
  "sleep_hours": 7,
  "stress_level": "Low"
}
```

---

### 9. Update Address
**Endpoint:** `PATCH /health-passport/address`  
**Access:** PATIENT, DOCTOR  
**Description:** Update address information only

**Request Body:**
```json
{
  "street_address": "456 Oak Ave",
  "city": "Los Angeles",
  "state": "CA",
  "postal_code": "90210",
  "country": "USA"
}
```

---

### 10. Update Emergency Contact
**Endpoint:** `PATCH /health-passport/emergency`  
**Access:** PATIENT, DOCTOR  
**Description:** Update emergency contact information only

**Request Body:**
```json
{
  "emergency_contact_name": "Jane Smith",
  "emergency_contact_phone": "+1987654321",
  "emergency_contact_relation": "Sister"
}
```

---

## Utility Endpoints

### 11. Check Health Passport Exists
**Endpoint:** `GET /health-passport/exists`  
**Access:** PATIENT, DOCTOR  
**Description:** Check if health passport exists for the authenticated user

**Response (200 OK):**
```json
{
  "exists": true,
  "user_id": "40b3ef75-8473-475e-9e73-cb769f1c45c5"
}
```

---

## Doctor Access Endpoints

### 12. Get User Health Passport (Doctor Only)
**Endpoint:** `GET /health-passport/user/{user_id}`  
**Access:** DOCTOR only  
**Description:** Get health passport for a specific user (doctor access only)

**URL Parameters:**
- `user_id`: UUID of the patient whose health passport to retrieve

**Response (200 OK):** Same as get health passport response

**Error Response (403 Forbidden) for non-doctors:**
```json
{
  "detail": "Insufficient permissions"
}
```

---

## Error Responses

### Common Error Codes
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Insufficient permissions (wrong role)
- **404 Not Found**: Health passport not found
- **422 Unprocessable Entity**: Invalid request data
- **500 Internal Server Error**: Server error

### Error Response Format
```json
{
  "detail": "Error message description"
}
```

---

## Testing

Run the comprehensive test suite:

```bash
python scripts/test_health_passport_apis.py
```

The test suite covers:
- User and doctor registration
- Health passport CRUD operations
- Partial updates
- RBAC validation (doctor access, patient restrictions)
- Error handling

---

## Data Models

### HealthPassportCreateRequest
All fields are optional except those marked required:
- `blood_group`: str
- `allergies`: str
- `height_cm`: float
- `weight_kg`: float
- `emergency_contact_name`: str
- `emergency_contact_phone`: str
- `emergency_contact_relation`: str
- `medical_conditions`: str
- `current_medications`: str
- `past_surgeries`: str
- `family_medical_history`: str
- `smoking_status`: str
- `alcohol_consumption`: str
- `exercise_frequency`: str
- `diet_type`: str
- `sleep_hours`: int
- `stress_level`: str
- `street_address`: str
- `city`: str
- `state`: str
- `postal_code`: str
- `country`: str

### HealthPassportResponse
Includes all create fields plus:
- `id`: str (UUID)
- `user_id`: str (UUID)
- `bmi`: float (auto-calculated)
- `created_at`: str (ISO datetime)
- `updated_at`: str (ISO datetime)

---

## Security Notes

- All endpoints require authentication
- Patients can only access their own health data
- Doctors can read any patient's health passport but cannot modify them
- JWT tokens must be included in Authorization header
- Role-based access is enforced at the route level
- Database operations use parameterized queries to prevent SQL injection