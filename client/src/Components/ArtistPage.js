import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '30px',
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


function ArtistPage() {
  const { id } = useParams();
  const [artistInfo, setArtistInfo] = useState({});
  const [albums, setAlbums] = useState([]);
  const [showAllAlbums, setShowAllAlbums] = useState(false);

  useEffect(() => {
    const artistId = id;

    axios.get(`/artists/${artistId}`)
      .then((response) => {
        setArtistInfo(response.data);
      })
      .catch((error) => {
        console.error('Error fetching artist info:', error);
      });

    axios.get(`/artists/${artistId}/albums`)
      .then((response) => {
        setAlbums(response.data.items);
      })
      .catch((error) => {
        console.error('Error fetching artist albums:', error);
      });
  }, [id]);

  const topAlbums = showAllAlbums ? albums : albums.slice(0, 5); // Show top 5 or all albums

  return (
    <div style={styles.container}>
      {/* Display artist information */}
      <h2>{artistInfo.name}</h2>
      {artistInfo.images && artistInfo.images.length > 0 ? (
        <img src={artistInfo.images[0].url} alt={`${artistInfo.name}`} style={styles.artistImage} />
      ) : (
        <p>No artist image available</p>
      )}

      {/* Display top albums */}
      <h3>Top Albums</h3>
      <ul style={styles.albumList}>
        {topAlbums.map((album) => (
          <li key={album.id} style={styles.albumItem}>
            {album.images && album.images.length > 0 ? (
              <img src={album.images[0].url} alt={`${album.name}`} style={styles.albumImage} />
            ) : (
              <p>No album image available</p>
            )}
            <Link to={`/albums/${album.id}`}>{album.name}</Link>
          </li>
        ))}
      </ul>

      {/* Show More button */}
      {!showAllAlbums && albums.length > 5 && (
        <button onClick={() => setShowAllAlbums(true)}>Show More Albums</button>
      )}
    </div>
  );
}

export default ArtistPage;
