import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

const AppRouter = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <>
      <Header />
      <NavBar />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Login /> : <Navigate to="/home" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/albums/:albumId" element={isAuthenticated ? <AlbumsPage /> : <Navigate to="/login" />} />
        <Route path="/artist/:id" element={isAuthenticated ? <ArtistPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} />
        <Route path="/track/:id" element={isAuthenticated ? <TrackPage /> : <Navigate to="/login" />} />
        <Route path="/user/reviews" element={isAuthenticated ? <UserReviewsPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default AppRouter;
