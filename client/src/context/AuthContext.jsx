// Authentication Context
import { createContext, useState, useCallback, useEffect } from 'react';
import apiClient from '../services/apiClient.js';
import { API_ENDPOINTS } from '../config/api.config.js';

export const AuthContext = createContext();

const normalizeProfileImageUrl = (profileImage) => {
  if (!profileImage) {
    return null;
  }

  const proxyPath = '/api/media/proxy?url=';

  if (profileImage.includes(proxyPath)) {
    const proxyIndex = profileImage.indexOf(proxyPath);
    return profileImage.slice(proxyIndex);
  }

  if (profileImage.includes('res.cloudinary.com')) {
    return `${proxyPath}${encodeURIComponent(profileImage)}`;
  }

  return profileImage;
};

const normalizeUser = (userData) => {
  if (!userData) {
    return userData;
  }

  return {
    ...userData,
    profileImage: normalizeProfileImageUrl(userData.profileImage),
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpContact, setOtpContact] = useState(null);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      try {
        const authData = JSON.parse(auth);
        setUser(normalizeUser(authData.user));
        setIsAuthenticated(true);

        apiClient.get(API_ENDPOINTS.AUTH.PROFILE)
          .then((response) => {
            const refreshedUser = normalizeUser(response.data);
            setUser(refreshedUser);

            const storedAuth = localStorage.getItem('auth');
            if (storedAuth) {
              const parsed = JSON.parse(storedAuth);
              parsed.user = refreshedUser;
              localStorage.setItem('auth', JSON.stringify(parsed));
            }
          })
          .catch((err) => {
            console.error('Failed to refresh profile state:', err);
          });
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
      const normalizedUser = normalizeUser(userData);

      // Store auth data
      apiClient.setAuth({
        user: normalizedUser,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });

      setUser(normalizedUser);
      setIsAuthenticated(true);
      setOtpSent(false);
      setOtpContact(null);

      return {
        success: true,
        user: normalizedUser,
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

  const updateProfile = useCallback(async ({ name, profileImageFile, removeProfileImage = false }) => {
    setIsProfileUpdating(true);
    setError(null);

    try {
      const formData = new FormData();

      if (name !== undefined) {
        formData.append('name', name);
      }

      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }

      if (removeProfileImage) {
        formData.append('removeProfileImage', 'true');
      }

      const response = await apiClient.patch(API_ENDPOINTS.AUTH.PROFILE, formData, {
        isFormData: true,
      });

      const updatedUser = normalizeUser(response.data);
      setUser(updatedUser);

      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        parsed.user = updatedUser;
        localStorage.setItem('auth', JSON.stringify(parsed));
      }

      return {
        success: true,
        user: updatedUser,
      };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update profile';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        details: err.details,
      };
    } finally {
      setIsProfileUpdating(false);
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
    isProfileUpdating,
    error,
    otpSent,
    otpContact,

    // Actions
    sendOTP,
    verifyOTP,
    updateProfile,
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
