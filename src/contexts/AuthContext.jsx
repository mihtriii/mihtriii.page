import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Admin credentials - Use environment variables in production
const ADMIN_CREDENTIALS = {
  username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
  password: import.meta.env.VITE_ADMIN_PASSWORD || 'mihtriii2025!',
};

const SESSION_DURATION = (import.meta.env.VITE_SESSION_DURATION || 24) * 60 * 60 * 1000; // Convert hours to milliseconds

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = () => {
      const authData = localStorage.getItem('adminAuth');
      if (authData) {
        try {
          const { token, expiry } = JSON.parse(authData);
          const now = new Date().getTime();

          // Check if token hasn't expired (24 hours)
          if (loginTime && Date.now() - loginTime < SESSION_DURATION) {
            setIsAuthenticated(true);
          } else {
            // Token expired, remove it
            localStorage.removeItem('adminAuth');
          }
        } catch (error) {
          // Invalid auth data, remove it
          localStorage.removeItem('adminAuth');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (username, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
          const authData = {
            token: 'authenticated',
            expiry: new Date().getTime() + SESSION_DURATION,
            loginTime: new Date().toISOString(),
          };

          localStorage.setItem('adminAuth', JSON.stringify(authData));
          setIsAuthenticated(true);
          resolve({ success: true });
        } else {
          reject({ success: false, message: 'Invalid username or password' });
        }
      }, 1000); // 1 second delay to simulate real authentication
    });
  };

  const logout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
