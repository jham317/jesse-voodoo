import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('artist');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (searchTerm) {
      let apiUrl;
      switch (selectedCategory) {
        case 'artist':
          apiUrl = `/artists/search?query=${searchTerm}`;
          break;
        case 'album':
          apiUrl = `/albums/search?query=${searchTerm}`;
          break;
        case 'track':
          apiUrl = `/tracks/search?query=${searchTerm}`;
          break;
        default:
          apiUrl = '';
      }

      axios
        .get(apiUrl)
        .then(async (response) => {
          if (Array.isArray(response.data)) {
            const formattedSuggestions = await Promise.all(response.data.map(async (result) => {
              if (result.type === 'album' && result.artists && result.artists.length > 0) {
                const albumInfo = await fetchAlbumInfo(result.id); // Fetch album info
                result.artistName = albumInfo ? albumInfo.artistName : 'Unknown Artist';
              }
              return result;
            }));
            setSuggestions(formattedSuggestions.slice(0, 5));
          } else {
            setSuggestions([]);
          }

        })
        .catch((error) => {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, selectedCategory]);

  // Function to fetch album information by ID
  async function fetchAlbumInfo(albumId) {
    try {
      const response = await axios.get(`/albums/${albumId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching album info:', error);
      return null;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Search for Music</h1>
      <div style={styles.searchContainer}>
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
          style={styles.select}
        >
          <option value="artist">Artists</option>
          <option value="album">Albums</option>
          <option value="track">Tracks</option>
        </select>
        <input
          type="text"
          placeholder="Enter your search query"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
        <button style={styles.button}>Search</button>
      </div>
      <ul style={styles.results}>
        {suggestions.map((result) => (
          <li key={result.id} style={styles.resultItem}>
            {result.type === 'artist' ? (
              <Link to={`/artist/${result.id}`} style={styles.link}>
                {result.name}
              </Link>
            ) : result.type === 'album' ? (
              <Link to={`/albums/${result.id}`} style={styles.link}>
                {result.name} (Album) by {result.artistName} {/* Ensure result.artistName is available */}
              </Link>
            ) : result.type === 'track' ? (
              <Link to={`/track/${result.id}`} style={styles.link}>
                {result.name} by {result.artists.map((artist) => artist.name).join(', ')}
              </Link>
            ) : (
              <span>{result.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  select: {
    padding: '0.5rem',
    border: '2px solid #ccc',
    borderRadius: '20px', // Rounded border
    marginRight: '1rem',
  },
  input: {
    padding: '0.5rem',
    border: '2px solid #ccc',
    borderRadius: '20px', // Rounded border
    marginRight: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#0073e6',
    color: 'white',
    border: 'none',
    borderRadius: '20px', // Rounded border
    cursor: 'pointer',
  },
  results: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  resultItem: {
    margin: '0.5rem 0',
  },
  link: {
    textDecoration: 'none',
    color: 'blue', // Modify link color as needed
  },
};

export default HomePage;
