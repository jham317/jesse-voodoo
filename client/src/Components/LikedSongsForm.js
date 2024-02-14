// Components/LikedSongsForm.js

import React, { useState } from 'react';
import axios from 'axios';

function LikedSongsForm({ trackId, trackInfo }) {
  const [liked, setLiked] = useState(false);
  const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage

  const handleLike = async () => {
    if (!token) {
      alert('Please log in to like songs.');
      return;
    }

    try {
        await axios.post('http://localhost:4000/liked-songs', { trackId, trackInfo }, { headers: { Authorization: `Bearer ${token}` } });


      setLiked(true); // Update UI to reflect the liked state
      alert('Song liked successfully!');
    } catch (error) {
      console.error('Error liking song:', error);
      alert('Failed to like the song. Please try again.');
    }
  };

  return (
    <button onClick={handleLike}>
      {liked ? 'Liked' : 'Like'}
    </button>
    
  );
}

export default LikedSongsForm;
