import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '20px',
    color: '#fff',
    fontFamily: 'Poppins, sans-serif',
  },
  trackImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    marginBottom: '20px',
  },
};

const LikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    fetchLikedSongs();
  }, []);

  const fetchLikedSongs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/user/liked-songs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLikedSongs(response.data);
    } catch (error) {
      console.error('Error fetching liked songs:', error);
    }
  };

  const handleUnlikeSong = async (trackId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/liked-songs/${trackId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLikedSongs();
    } catch (error) {
      console.error('Error unliking song:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Liked Songs</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
      {likedSongs.map((likedSong, index) => (
  <div key={`${likedSong.trackId}-${index}`} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', textAlign: 'left' }}>
            {likedSong.trackInfo && likedSong.trackInfo.album && likedSong.trackInfo.album.images && likedSong.trackInfo.album.images.length > 0 && (
              <img src={likedSong.trackInfo.album.images[0].url} alt={`Cover for ${likedSong.trackInfo.name}`} style={styles.trackImage} />
            )}
            <p><strong>Name:</strong> {likedSong.trackInfo?.name || 'Unknown'}</p>
            <p>
              <strong>Artist:</strong>{' '}
              {likedSong.trackInfo?.artists?.map((artist, index) => (
                <React.Fragment key={artist._id}>
                  <Link to={`/artist/${artist._id}`}>{artist.name}</Link>
                  {index !== likedSong.trackInfo.artists.length - 1 && ', '}
                </React.Fragment>
              ))}
            </p>
            <button onClick={() => handleUnlikeSong(likedSong.trackId)}>Unlike</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default LikedSongs;
