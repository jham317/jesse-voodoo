import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Example: Send a request to your backend to verify the token
        try {
          const response = await fetch('/api/verifyToken', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          if (response.ok) {
            const data = await response.json();
            // Update the authentication state based on the response
            setCurrentUser(data.user);
          } else {
            // Handle invalid token (e.g., remove it and log out the user)
            localStorage.removeItem('token');
            setCurrentUser(null);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
        }
      }
    };
  
    verifyToken();
  }, []);
  

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
