import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import HomePage from './HomePage';
import AlbumsPage from './AlbumsPage'; // Import the AlbumsPage component
import ArtistPage from './ArtistPage';
import UserProfile from './UserProfile';

const AppRouter = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/albums/:albumId" element={<AlbumsPage />} /> {/* Define 'element' prop here */}
        <Route path="/artist/:id" element={<ArtistPage />} />
        <Route path="/profile" element={<UserProfile />} />
        {/* Add other routes here */}
      </Routes>
      <Footer />
    </>
  );
};

export default AppRouter;
