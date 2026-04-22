// HTTP/API Client Utility
import API_CONFIG from '../config/api.config.js';

class APIClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Get stored access token from localStorage
   */
  getAccessToken() {
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.accessToken;
      }
    } catch (error) {
      console.error('Error retrieving access token:', error);
    }
    return null;
  }

  /**
   * Get stored refresh token from localStorage
   */
  getRefreshToken() {
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.refreshToken;
      }
    } catch (error) {
      console.error('Error retrieving refresh token:', error);
    }
    return null;
  }

  /**
   * Make HTTP request with automatic token attachment
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        ...API_CONFIG.HEADERS,
        ...options.headers,
      },
    };

    const isFormData = config.isFormData || config.body instanceof FormData;

    // Attach access token for protected endpoints
    const accessToken = this.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // For FormData, set appropriate headers
    if (isFormData) {
      delete config.headers['Content-Type'];
      delete config.isFormData;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        // Handle unauthorized - token might be expired
        if (response.status === 401) {
          this.handleTokenExpired();
        }
        throw {
          status: response.status,
          message: data.message || 'API Error',
          errorCode: data.errorCode,
          details: data.details,
        };
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw {
          status: 408,
          message: 'Request timeout',
          errorCode: 'REQUEST_TIMEOUT',
        };
      }
      throw error;
    }
  }

  /**
   * GET request
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  post(endpoint, body = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: options.isFormData || body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  /**
   * PUT request
   */
  put(endpoint, body = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: options.isFormData || body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  /**
   * PATCH request
   */
  patch(endpoint, body = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: options.isFormData || body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  /**
   * DELETE request
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  /**
   * Handle token expiration - dispatch logout
   */
  handleTokenExpired() {
    localStorage.removeItem('auth');
    window.location.href = '/';
  }

  /**
   * Store authentication data
   */
  setAuth(authData) {
    localStorage.setItem('auth', JSON.stringify(authData));
  }

  /**
   * Clear authentication data
   */
  clearAuth() {
    localStorage.removeItem('auth');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getAccessToken();
  }
}

export default new APIClient();
