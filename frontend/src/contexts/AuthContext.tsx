import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { LoginResponse } from '../services/authService';
import apiClient from '../config/api';

// Type definitions
interface AuthContextType {
  isAuthenticated: boolean;
  user: LoginResponse['user'] | null;
  token: string | null;
  login: (data: LoginResponse) => void;
  logout: () => void;
  isLoading: boolean;
}

// Default context values
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
};

// Create context
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Context provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load authentication state from localStorage on mount
  useEffect(() => {
    const loadAuth = () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Set the token in API client headers
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        } catch (error) {
          console.error('Error parsing stored user:', error);
          // Clear invalid data
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
      }
      
      setIsLoading(false);
    };

    loadAuth();
  }, []);

  // Login function - stores auth data and updates state
  const login = (data: LoginResponse) => {
    const { token, user } = data;
    
    // Store in localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
    
    // Update state
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
    
    // Set the token in API client headers
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  // Logout function - clears auth data and updates state
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    
    // Update state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    // Remove the token from API client headers
    delete apiClient.defaults.headers.common['Authorization'];
  };

  // Provide the context value
  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 