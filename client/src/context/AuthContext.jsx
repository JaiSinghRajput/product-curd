// Authentication Context
import { createContext, useState, useCallback, useEffect } from 'react';
import apiClient from '../services/apiClient.js';
import { API_ENDPOINTS } from '../config/api.config.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpContact, setOtpContact] = useState(null);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      try {
        const authData = JSON.parse(auth);
        setUser(authData.user);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error restoring auth state:', err);
        localStorage.removeItem('auth');
      }
    }
  }, []);

  /**
   * Send OTP to email or phone
   */
  const sendOTP = useCallback(async (emailOrPhone) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.SEND_OTP,
        { emailOrPhone }
      );

      setOtpSent(true);
      setOtpContact(emailOrPhone);

      return {
        success: true,
        data: response.data,
      };
    } catch (err) {
      const errorMessage = err.message || 'Failed to send OTP';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        details: err.details,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Verify OTP and get tokens
   */
  const verifyOTP = useCallback(async (emailOrPhone, otp) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.VERIFY_OTP,
        { emailOrPhone, otp }
      );

      const { user: userData, tokens } = response.data;

      // Store auth data
      apiClient.setAuth({
        user: userData,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });

      setUser(userData);
      setIsAuthenticated(true);
      setOtpSent(false);
      setOtpContact(null);

      return {
        success: true,
        user: userData,
      };
    } catch (err) {
      const errorMessage = err.message || 'Failed to verify OTP';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        details: err.details,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh access token
   */
  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = apiClient.getRefreshToken();
      if (!refreshToken) {
        logout();
        return false;
      }

      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        { refreshToken }
      );

      const { accessToken } = response.data;

      // Update stored token
      const auth = JSON.parse(localStorage.getItem('auth'));
      auth.accessToken = accessToken;
      localStorage.setItem('auth', JSON.stringify(auth));

      return true;
    } catch (err) {
      console.error('Token refresh failed:', err);
      logout();
      return false;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // Call logout endpoint
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear auth regardless of API response
      apiClient.clearAuth();
      setUser(null);
      setIsAuthenticated(false);
      setOtpSent(false);
      setOtpContact(null);
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    otpSent,
    otpContact,

    // Actions
    sendOTP,
    verifyOTP,
    logout,
    refreshAccessToken,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
