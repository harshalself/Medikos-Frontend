/**
 * API Configuration
 * Central configuration for all API endpoints and settings
 */

// Get base URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

/**
 * API Endpoints
 * Add endpoints here as you receive backend API documentation
 * 
 * Example structure:
 * export const API_ENDPOINTS = {
 *   auth: {
 *     login: '/api/auth/login',
 *     register: '/api/auth/register',
 *   },
 *   users: {
 *     list: '/api/users',
 *     detail: (id: string) => `/api/users/${id}`,
 *   },
 * } as const;
 */
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    signup: '/api/auth/signup',
    me: '/api/auth/me',
    profile: '/api/auth/profile',
    resetPassword: '/api/auth/reset-password',
    updatePassword: '/api/auth/update-password',
    logout: '/api/auth/logout',
    protected: '/api/auth/protected',
    doctorPatients: '/api/auth/doctor/patients',
  },
  healthPassport: {
    base: '/api/health-passport',
    exists: '/api/health-passport/exists',
    basic: '/api/health-passport/basic',
    vitals: '/api/health-passport/vitals',
    lifestyle: '/api/health-passport/lifestyle',
    address: '/api/health-passport/address',
    emergency: '/api/health-passport/emergency',
    // Doctor endpoints for viewing patient health passports
    viewPatient: (userId: number) => `/api/health-passport/user/${userId}`,
  },
  medicineSuggester: {
    suggestAlternatives: '/api/medicine-suggester/suggest-alternatives',
    // Doctor endpoints for viewing patient medicine history
    doctorHistory: '/api/medicine-suggester/doctor/medicine-history',
  },
  medivault: {
    upload: '/api/medivault/upload',
    documents: '/api/medivault/documents',
    download: (documentId: number) => `/api/medivault/download/${documentId}`,
    delete: (documentId: number) => `/api/medivault/${documentId}`,
  },
  remediesSuggestion: {
    suggest: '/api/remedies-suggestion/suggest',
    // Doctor endpoints for viewing patient remedies search history
    doctorUserSearches: (userId: string) => `/api/remedies-suggestion/doctor/user-searches/${userId}`,
  },
  healthDiary: {
    create: '/api/health-diary',
    list: '/api/health-diary',
    delete: (entryId: string) => `/api/health-diary/${entryId}`,
    summary: '/api/health-diary/summary',
    // Doctor endpoints for viewing patient health diary
    doctorPatientEntries: (userId: string) => `/api/health-diary/doctor/patient/${userId}`,
    doctorPatientSummary: (userId: string) => `/api/health-diary/doctor/patient/${userId}/summary`,
  },
} as const;

/**
 * Common HTTP Headers
 */
export const getCommonHeaders = (includeAuth = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};
