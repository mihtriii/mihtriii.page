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

function getSessionExpiry(authData = {}) {
  if (typeof authData.expiry === 'number' && Number.isFinite(authData.expiry)) {
    return authData.expiry;
  }

  if (typeof authData.expiry === 'string' && authData.expiry !== '') {
    const parsedExpiry = Number(authData.expiry);
    if (Number.isFinite(parsedExpiry)) {
      return parsedExpiry;
    }
  }

  if (typeof authData.loginTime === 'string') {
    const parsedLoginTime = new Date(authData.loginTime).getTime();
    if (Number.isFinite(parsedLoginTime)) {
      return parsedLoginTime + SESSION_DURATION;
    }
  }

  return null;
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = () => {
      const authData = localStorage.getItem('adminAuth');
      if (authData) {
        try {
          const parsedAuth = JSON.parse(authData);
          const expiryTime = getSessionExpiry(parsedAuth);

          if (parsedAuth?.token === 'authenticated' && expiryTime && Date.now() < expiryTime) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('adminAuth');
          }
        } catch {
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
