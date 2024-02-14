import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjusted to the correct path

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth(); // Use the auth context to determine if a user is logged in

  return currentUser ? children : <Navigate to="/login" />; // Redirect to login if not authenticated
};

export default ProtectedRoute;
