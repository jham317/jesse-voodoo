import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import RatingForm from './RatingForm'; // Import the RatingForm component

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
  albumImage: {
    width: '200px',
    height: '200px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  tracklist: {
    listStyle: 'none',
    padding: '0',
  },
  trackItem: {
    padding: '10px 0',
    borderBottom: '2px solid #ccc',
  },
  ratingContainer: {
    marginTop: '20px',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '10px',
  },
};

function AlbumsPage() {
  const { albumId } = useParams();
  const [albumDetails, setAlbumDetails] = useState({});
  const [tracklist, setTracklist] = useState([]);
  const [artistId, setArtistId] = useState('');
  const [userId, setUserId] = useState(null); // Initialize userId state

  useEffect(() => {
    // Fetch album details by albumId
    axios.get(`/albums/${albumId}`)
      .then((response) => {
        const albumData = response.data;

        // Accessing artist name, release date, and cover image URL
        const artistName = albumData.artists.map((artist) => artist.name).join(', ');
        const releaseDate = albumData.release_date;
        const coverImageUrl = albumData.images[0].url;
        const artistId = albumData.artists[0].id;

        // Set album details and artistId in the state
        setAlbumDetails({
          name: albumData.name,
          artist: artistName,
          releaseDate: releaseDate,
          imageUrl: coverImageUrl,
        });
        setArtistId(artistId);
      })
      .catch((error) => {
        console.error('Error fetching album details:', error);
        setAlbumDetails({});
      });

    // Fetch tracklist for the album
    axios.get(`/albums/${albumId}/tracks`)
      .then((response) => {
        setTracklist(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tracklist:', error);
        setTracklist([]);
      });

    // Simulate user authentication and set the userId state
    // Replace this with your actual authentication logic
    // In this example, we are assuming that user data is available in the window object
    const user = window.user; // You need to replace this with your actual user data retrieval logic

    if (user) {
      setUserId(user.id); // Set the user ID if the user is authenticated
    }
  }, [albumId]);
  
  return (
    <div style={styles.container}>
      <h1>Album Details</h1>
      <h2>{albumDetails.name}</h2>
      <p>
        Artist: <Link to={`/artist/${artistId}`} style={{ color: 'var(--prince-yellow)' }}>{albumDetails.artist}</Link>
      </p>
      <p>Release Date: {albumDetails.releaseDate}</p>
      <img src={albumDetails.imageUrl} alt={`Cover for ${albumDetails.name}`} style={styles.albumImage} />

      <h2>Tracklist</h2>
      <ul style={styles.tracklist}>
        {tracklist.map((track) => (
          <li key={track.id} style={styles.trackItem}>
            <Link to={`/track/${track.id}`} style={{ color: 'var(--prince-yellow)' }}>{track.name}</Link>
          </li>
        ))}
      </ul>
      <div style={styles.ratingContainer}>
        <h2>Rate this Album</h2>
        {/* Pass the albumId and userId to the RatingForm component */}
        <RatingForm albumId={albumId} userId={userId} />
      </div>
    </div>
  );
}

export default AlbumsPage;
