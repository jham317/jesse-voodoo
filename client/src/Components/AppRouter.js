import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './Header';

import HomePage from './HomePage';
import AlbumsPage from './AlbumsPage'; // Import the AlbumsPage component
import ArtistPage from './ArtistPage';
import UserProfile from './UserProfile';
import TrackPage from './TrackPage';
import Login from './Login'; // Import the Login component
import Signup from './Signup'; // Import the Login component
import NavBar from './NavBar'; 

const AppRouter = () => {
  return (
    <>
      <Header />
      <NavBar /> {/* Include the NavBar component */}
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<HomePage />} /> {/* Define /home route */}
      <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/albums/:albumId" element={<AlbumsPage />} /> {/* Define 'element' prop here */}
        <Route path="/artist/:id" element={<ArtistPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/track/:id" Component={TrackPage} /> {/* Add the track route */}
        {/* Add other routes here */}
      </Routes>
     
    </>
  );
};

export default AppRouter;
