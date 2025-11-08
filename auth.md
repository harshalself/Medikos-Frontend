# Authentication API

Core authentication system with JWT tokens, user management, and profile operations. Uses role-based access control (RBAC) with PATIENT and DOCTOR roles, though most auth operations are self-service.

## Endpoints

### 1. User Registration
**POST** `/api/auth/signup`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "full_name": "John Doe",
  "role": "patient"
}
```

**Request Fields:**
- `email` (required): Valid email address
- `password` (required): Minimum 6 characters
- `full_name` (optional): User's full name
- `role` (optional): Either "patient" or "doctor", defaults to "patient"

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "role": "patient",
    "full_name": "John Doe",
    "created_at": "2025-11-08T06:48:58.039357+00:00"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
}
```

### 2. User Login
**POST** `/api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "role": "patient",
    "full_name": "John Doe"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
}
```

### 3. Get Current User
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "role": "patient",
    "full_name": "John Doe",
    "phone": null,
    "date_of_birth": null,
    "gender": null,
    "avatar_url": null,
    "created_at": "2025-11-08T06:48:58.039357+00:00",
    "updated_at": "2025-11-08T06:48:58.039357+00:00"
  }
}
```

### 4. Get User Profile
**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "role": "patient",
  "full_name": "John Doe",
  "phone": "+1234567890",
  "date_of_birth": "1990-01-01",
  "gender": "other",
  "avatar_url": null,
  "created_at": "2025-11-08T06:48:58.039357+00:00",
  "updated_at": "2025-11-08T06:48:58.039357+00:00"
}
```

### 5. Update User Profile
**PUT** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request:**
```json
{
  "full_name": "Updated Name",
  "phone": "+1234567890",
  "gender": "male|female|other",
  "date_of_birth": "1990-01-01"
}
```

**Response (200):**
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "role": "patient",
  "full_name": "Updated Name",
  "phone": "+1234567890",
  "date_of_birth": "1990-01-01",
  "gender": "other",
  "avatar_url": null,
  "created_at": "2025-11-08T06:48:58.039357+00:00",
  "updated_at": "2025-11-08T06:49:00.612469+00:00"
}
```

### 6. Password Reset Request
**POST** `/api/auth/reset-password`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "Password reset email sent"
}
```

### 7. Update Password
**POST** `/api/auth/update-password`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request:**
```json
{
  "new_password": "newsecurepassword123"
}
```

**Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

### 8. User Logout
**POST** `/api/auth/logout`

**Response (200):**
```json
{
  "message": "Successfully signed out"
}
```

### 9. Protected Route Example
**GET** `/api/auth/protected`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Hello John Doe!",
  "user_id": "uuid-string",
  "email": "user@example.com"
}
```

### 10. Get All Patients (Doctor Only)
**GET** `/api/auth/doctor/patients`

Get list of all registered patients. Accessible only to users with `doctor` role.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "patients": [
    {
      "id": "uuid-string",
      "email": "patient1@example.com",
      "role": "patient",
      "full_name": "John Doe",
      "phone": "+1234567890",
      "date_of_birth": "1990-01-01",
      "gender": "male",
      "avatar_url": null,
      "created_at": "2025-11-08T06:48:58.039357+00:00",
      "updated_at": "2025-11-08T06:48:58.039357+00:00"
    }
  ],
  "total_count": 1
}
```

## Authentication

- **JWT Bearer Token**: Include `Authorization: Bearer <token>` header for protected routes
- **Token Expiry**: Tokens expire after configured time (check JWT settings)
- **Role-Based Access**: Users have either `patient` or `doctor` role, but auth endpoints are self-service

## RBAC Analysis

**RBAC Not Required**: Unlike data access APIs (health diary, medicine suggester), auth endpoints are self-service operations where users only access their own authentication data. All authenticated users (both PATIENT and DOCTOR roles) can perform these operations.

## Error Responses

**401 Unauthorized:**
```json
{
  "detail": "Invalid token"
}
```

**400 Bad Request:**
```json
{
  "detail": "Validation error message"
}
```

**422 Unprocessable Entity:**
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

## Testing

Run comprehensive tests:
```bash
python scripts/test_auth_apis.py
```

**Test Results:** ✅ 13/13 tests passed
- Health check, signup, login, profile operations
- Password management, protected routes
- Doctor patient list access, invalid token handling

## Security Features

- **Password Hashing**: bcrypt encryption
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Pydantic schema validation
- **SQL Injection Protection**: SQLAlchemy ORM
- **Rate Limiting**: Configurable request limits</content>
<parameter name="filePath">/Users/harshalpatil/Documents/Projects/Medikos-Backend/AUTH_README.md