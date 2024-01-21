import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import HomePage from './HomePage';
import AlbumsPage from './AlbumsPage';
import AlbumDetails from './AlbumDetails';
import UserProfile from './UserProfile';

const AppRouter = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/albums" element={<AlbumsPage />} />
        <Route path="/albums/:id" element={<AlbumDetails />} />
        <Route path="/profile" element={<UserProfile />} />
        {/* Add other routes here */}
      </Routes>
      <Footer />
    </>
  );
};

export default AppRouter;
