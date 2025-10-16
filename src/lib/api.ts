/**
 * API Client
 * Centralized fetch wrapper with error handling and authentication
 */

import { API_BASE_URL, API_TIMEOUT, getCommonHeaders } from './api-config';

/**
 * API Error Class
 */
export class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'APIError';
  }
}

/**
 * API Request Options
 */
interface RequestOptions extends RequestInit {
  timeout?: number;
  includeAuth?: boolean;
}

/**
 * Fetch with timeout support
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestOptions = {}
): Promise<Response> => {
  const { timeout = API_TIMEOUT, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new APIError(408, 'Request Timeout');
    }
    throw error;
  }
};

/**
 * Main API Client
 */
class APIClient {
  /**
   * Generic request method
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { includeAuth = true, headers: customHeaders, ...restOptions } = options;
    
    // Build full URL
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${API_BASE_URL}${endpoint}`;
    
    console.log('API Request URL:', url);
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Endpoint:', endpoint);
    // Merge headers
    const headers = {
      ...getCommonHeaders(includeAuth),
      ...customHeaders,
    };
    
    try {
      const response = await fetchWithTimeout(url, {
        ...restOptions,
        headers,
      });
      
      // Handle non-OK responses
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }
        
        // Handle token expiration
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        
        throw new APIError(response.status, response.statusText, errorData);
      }
      
      // Handle no content
      if (response.status === 204) {
        return {} as T;
      }
      
      // Parse JSON response
      const data = await response.json();
      return data as T;
      
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      // Network or other errors
      throw new APIError(0, 'Network Error', { message: (error as Error).message });
    }
  }
  
  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }
  
  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
  
  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
  
  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
  
  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
  
  /**
   * Upload file (multipart/form-data)
   */
  async upload<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestOptions
  ): Promise<T> {
    const { includeAuth = true, headers: customHeaders, ...restOptions } = options || {};
    
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${API_BASE_URL}${endpoint}`;
    
    // For FormData, don't set Content-Type (browser will set it with boundary)
    const headers: HeadersInit = {};
    if (includeAuth) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    try {
      const response = await fetchWithTimeout(url, {
        ...restOptions,
        method: 'POST',
        headers: { ...headers, ...customHeaders },
        body: formData,
      });
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }
        throw new APIError(response.status, response.statusText, errorData);
      }
      
      const data = await response.json();
      return data as T;
      
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(0, 'Network Error', { message: (error as Error).message });
    }
  }
}

// Export singleton instance
export const api = new APIClient();

// Export for convenience
export default api;
