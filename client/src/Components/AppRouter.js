// AppRouter.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import HomePage from './HomePage';
import AlbumsPage from './AlbumsPage';
import ArtistPage from './ArtistPage';
import UserProfile from './UserProfile';
import TrackPage from './TrackPage';
import Login from './Login';
import Signup from './Signup';
import NavBar from './NavBar';
import UserReviewsPage from './UserReviewsPage';

const AppRouter = () => {
  return (
    <>
      <Header />
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<HomePage />} /> {/* Confirm that HomePage is associated with '/home' */}
        <Route path="/albums/:albumId" element={<AlbumsPage />} />
        <Route path="/artist/:id" element={<ArtistPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/track/:id" element={<TrackPage />} />
        <Route path="/user/reviews" element={<UserReviewsPage />} />
        {/* Default route should be the last one */}
        <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
};

export default AppRouter;
