import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; // Adjust the path as per your file structure
// Import all other components
import Header from './Header';
import NavBar from './NavBar';
import HomePage from './HomePage';
import AlbumsPage from './AlbumsPage';
import ArtistPage from './ArtistPage';
import UserProfile from './UserProfile';
import TrackPage from './TrackPage';
import Login from './Login';
import Signup from './Signup';
import UserReviewsPage from './UserReviewsPage';
import LikedSongs from './LikedSongs';
// Import the ProtectedRoute component
import ProtectedRoute from './ProtectedRoute'; // Assuming ProtectedRoute.js is in the same directory

const AppRouter = () => {
  return (
    <AuthProvider> {/* Wrap your Routes with AuthProvider */}
      <>
        <Header />
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Redirect to login if not authenticated */}
          <Route path="/" element={<Navigate to="/login" />} />
          {/* Protect the routes using ProtectedRoute */}
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/albums/:albumId" element={<ProtectedRoute><AlbumsPage /></ProtectedRoute>} />
          <Route path="/artist/:id" element={<ProtectedRoute><ArtistPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/track/:id" element={<ProtectedRoute><TrackPage /></ProtectedRoute>} />
          <Route path="/liked-songs" element={<ProtectedRoute><LikedSongs /></ProtectedRoute>} />
          <Route path="/user/reviews" element={<ProtectedRoute><UserReviewsPage /></ProtectedRoute>} />
        </Routes>
      </>
    </AuthProvider>
  );
};

export default AppRouter;
