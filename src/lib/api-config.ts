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
    profile: '/api/auth/profile',
    logout: '/api/auth/logout',
  },
  healthPassport: {
    base: '/api/health-passport',
    exists: '/api/health-passport/exists',
    basic: '/api/health-passport/basic',
    medical: '/api/health-passport/medical',
    vitals: '/api/health-passport/vitals',
    lifestyle: '/api/health-passport/lifestyle',
    address: '/api/health-passport/address',
    emergency: '/api/health-passport/emergency',
  },
  medicineSuggester: {
    suggestAlternatives: '/api/medicine-suggester/suggest-alternatives',
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
