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
  const [userReview, setUserReview] = useState(null); // Initialize userReview state

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

    // Fetch user reviews with album details
    const fetchReviews = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("User not logged in");
        return;
      }

      try {
        const response = await axios.get('http://localhost:4000/user/reviews', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reviewsWithDetails = await Promise.all(response.data.map(async (review) => {
          const albumDetailsResponse = await axios.get(`http://localhost:4000/albums/${review.albumId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return {
            ...review,
            albumDetails: albumDetailsResponse.data,
          };
        }));
        // Find the user's review for the current album
        const userReviewForAlbum = reviewsWithDetails.find(review => review.albumId === albumId);
        setUserReview(userReviewForAlbum);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
        setUserReview(null);
      }
    };

    fetchReviews();

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
        <h2>User Review</h2>
        {userReview ? (
          <>
            <p>User Rating: {userReview.rating}</p>
            <p>User Review: {userReview.reviewText}</p>
            <p>Strength: {userReview.strength}</p>
          </>
        ) : (
          <p>No review found.</p>
        )}
      </div>

      <div style={styles.ratingContainer}>
        <h2>Rate this Album</h2>
        {/* Pass the albumId and userId to the RatingForm component */}
        <RatingForm albumId={albumId} userId={userId} />
      </div>
    </div>
  );
}

export default AlbumsPage;
