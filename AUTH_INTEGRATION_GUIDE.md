# Medikos Backend - Auth API Integration Guide

## Essential Details for Frontend Integration

### 1. Base URL
**Development (with Vite proxy):**
```
(empty - requests go through Vite proxy to http://localhost:8000/api)
```

**Production:**
```
https://your-backend-domain.com/api
```

### 2. API Endpoints
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `POST /auth/reset-password` - Request password reset
- `POST /auth/update-password` - Update password (authenticated)
- `POST /auth/logout` - Logout user
- `GET /auth/me?token=<access_token>` - Get current user by token

### 3. Request Format
**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <access_token>` (for protected routes)

**Request Body Examples:**
```json
// Signup
{
  "email": "user@example.com",
  "password": "securepassword123",
  "full_name": "John Doe"
}

// Login
{
  "email": "user@example.com",
  "password": "securepassword123"
}

// Update Profile
{
  "full_name": "Jane Doe",
  "phone": "+1987654321",
  "date_of_birth": "1992-05-15",
  "gender": "female",
  "avatar_url": "https://example.com/new-avatar.jpg"
}
```

### 4. Response Format
**Success Response Structure:**
```json
{
  "message": "Success message",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "date_of_birth": "1990-01-01",
    "gender": "male",
    "avatar_url": "https://example.com/avatar.jpg",
    "created_at": "2025-10-16T10:30:00Z",
    "updated_at": "2025-10-16T10:30:00Z"
  },
  "session": {
    "access_token": "jwt-token-here",
    "refresh_token": "refresh-token-here",
    "expires_at": 1634380200
  }
}
```

### 5. Request/Response Examples

#### Registration
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "full_name": "John Doe"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "created_at": "2025-10-16T10:30:00Z"
  },
  "session": {
    "access_token": "jwt-token-here",
    "refresh_token": "refresh-token-here",
    "expires_at": 1634380200
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

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
    "email": "user@example.com"
  },
  "session": {
    "access_token": "jwt-token-here",
    "refresh_token": "refresh-token-here",
    "expires_at": 1634380200
  }
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "full_name": "John Doe",
  "phone": "+1234567890",
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "avatar_url": "https://example.com/avatar.jpg",
  "created_at": "2025-10-16T10:30:00Z",
  "updated_at": "2025-10-16T10:30:00Z"
}
```

### 6. Authentication Requirements
- JWT-based authentication using Bearer tokens
- Include `Authorization: Bearer <access_token>` header for protected routes
- Store `access_token` and `refresh_token` securely (localStorage recommended for web apps)
- Handle token expiration (401 responses) by redirecting to login

### 7. Error Handling
**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `422` - Unprocessable Entity (validation errors)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "detail": "Error message"
}
```

**Validation Errors:**
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

### 8. Rate Limiting
**Currently Disabled** - No rate limiting is applied to auth endpoints.

### 9. Environment Setup
**Frontend Environment Variables:**
```javascript
// .env.local or .env (development)
VITE_API_BASE_URL=  // Leave empty to use Vite proxy
VITE_API_TIMEOUT=30000

// .env (production)
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_API_TIMEOUT=30000
```

**Backend Environment Variables:**
```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
DEBUG=false
APP_NAME=Medikos Backend
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 10. CORS Configuration
**Allowed Origins:** `http://localhost:3000, http://127.0.0.1:3000, http://localhost:8080, http://127.0.0.1:8080`

Configure your frontend to handle CORS properly in production environments.

## React Integration Example

```javascript
// api/auth.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token expiry
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  signup: (data) => authAPI.post('/auth/signup', data),
  login: (data) => authAPI.post('/auth/login', data),
  getProfile: () => authAPI.get('/auth/profile'),
  updateProfile: (data) => authAPI.put('/auth/profile', data),
  resetPassword: (data) => authAPI.post('/auth/reset-password', data),
  updatePassword: (data) => authAPI.post('/auth/update-password', data),
  logout: () => authAPI.post('/auth/logout'),
};
```

## Testing the Integration

### Using the Test Script

Run the comprehensive auth test:

```bash
cd /path/to/medikos-backend
python scripts/test_auth_apis.py
```

### Manual Testing with cURL

```bash
# Register a new user
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "full_name": "Test User"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'

# Get profile (replace TOKEN with actual token)
curl -X GET http://localhost:8000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

## Security Best Practices

### Token Storage
- Store tokens securely (localStorage is acceptable for web apps, but consider httpOnly cookies for better security)
- Implement token refresh logic
- Clear tokens on logout

### Password Requirements
- Minimum 6 characters
- Encourage strong passwords
- Implement password reset flow

### CORS Configuration
- Configure allowed origins properly in production
- Use HTTPS in production
- Implement proper CORS headers

### Rate Limiting
- **Currently Disabled** - No rate limiting is applied to any endpoints

## Support

For issues or questions about the auth integration:

1. Check the API documentation at `http://localhost:8000/docs`
2. Review the test scripts in `scripts/test_auth_apis.py`
3. Check server logs for detailed error information
4. Ensure all environment variables are properly configured

## Next Steps

After implementing authentication, you can integrate other features:

- **Health Passport**: `/health-passport/*` endpoints
- **Health Diary**: `/health-diary/*` endpoints
- **Medicine Suggester**: `/medicine-suggester/*` endpoints
- **Remedies Suggestion**: `/remedies-suggestion/*` endpoints

Each module follows similar authentication patterns using the Bearer token in the Authorization header.