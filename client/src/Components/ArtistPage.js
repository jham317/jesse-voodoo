import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
  artistImage: {
    width: '200px',
    height: '200px',
    borderRadius: '50%', // Circular image for artist
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  albumList: {
    listStyle: 'none',
    padding: '0',
  },
  albumItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  albumImage: {
    width: '50px',
    height: '50px',
    borderRadius: '5px',
    marginRight: '10px',
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
