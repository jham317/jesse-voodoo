import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '20px',
    color: '#fff', // White text for better contrast against purple
    fontFamily: 'Poppins, sans-serif', // Use Poppins as the primary font
  
  },
  artistImage: {
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    marginBottom: '20px',
  },
  albumList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', // Creates a responsive grid
    gap: '20px', // Space between grid items
    padding: '0',
    marginTop: '20px',
  },
  albumItem: {
    display: 'flex',
    flexDirection: 'column', // Stack image and text vertically
    alignItems: 'center', // Center-align the content
    marginBottom: '15px',
    borderRadius: '10px',
    backgroundColor: '#6a0dad', // Maintain purple background for consistency
    color: '#fff', // Ensure album name is visible against purple
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '10px',
  },
  albumImage: {
    width: '100%', // Make images larger and responsive within their containers
    height: 'auto', // Maintain aspect ratio
    borderRadius: '5px',
  },
  link: {
    color: '#fff', // White text for links
    textDecoration: 'none',
    marginTop: '10px', // Space between image and album name
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    marginTop: '20px',
    fontSize: '16px',
  },
};


function TrackPage() {
  const { id } = useParams();
  const [trackInfo, setTrackInfo] = useState({});
  const [albumInfo, setAlbumInfo] = useState({});
  const [trackImage, setTrackImage] = useState(''); // State for the track image URL
  const [artistId, setArtistId] = useState(''); // State for the artist's ID

  useEffect(() => {
    const trackId = id;

    // Fetch track information by ID
    axios
      .get(`/tracks/${trackId}`)
      .then((response) => {
        setTrackInfo(response.data);
        // track data, fetch album information
        const albumId = response.data.album.id;
        axios
          .get(`/albums/${albumId}`)
          .then((albumResponse) => {
            setAlbumInfo(albumResponse.data);
            // Set the track image URL
            setTrackImage(response.data.album.images[0].url);
            // Set the artist's ID
            setArtistId(response.data.artists[0].id);
          })
          .catch((albumError) => {
            console.error('Error fetching album info:', albumError);
          });
      })
      .catch((error) => {
        console.error('Error fetching track info:', error);
      });
  }, [id]);

  return (
    <div style={styles.container}>
      <h2>Track Details</h2>
      <p><strong>Name:</strong> {trackInfo.name}</p>
      <p>
        <strong>Artist:</strong> <Link to={`/artist/${artistId}`}>{trackInfo.artists ? trackInfo.artists.map((artist) => artist.name).join(', ') : 'Unknown'}</Link>
      </p>
      <p><strong>Album:</strong> {albumInfo.name || 'Unknown Album'}</p>
      <p><strong>Duration:</strong> {msToMinutesAndSeconds(trackInfo.duration_ms)}</p>
      
      {/* Display the track image */}
      {trackImage && <img src={trackImage} alt={`Cover for ${trackInfo.name}`} style={styles.trackImage} />}

      {/* Link to AlbumsPage for the album */}
      {albumInfo.id && (
        <p><strong>Album:</strong> <Link to={`/albums/${albumInfo.id}`}>{albumInfo.name}</Link></p>
      )}

      {/*  add more track details here */}
    </div>
  );
}

// Helper function to convert milliseconds to minutes and seconds
function msToMinutesAndSeconds(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export default TrackPage;
