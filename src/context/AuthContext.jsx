import React, { createContext, useState, useContext, useEffect } from 'react';
import { getMe } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        try {
          const response = await getMe(); // Returns { success: true, data: { ... } }
          
          // STRICT SWAGGER ALIGNMENT:
          if (response.data) {
             setUser(response.data);
          } else {
             // Fallback just in case structure changes
             setUser(response);
          }
        } catch (error) {
          console.error('Failed to fetch user', error);
          logout();
        }
      }
    };
    fetchUser();
  }, [token, user]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);