import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('artist');
  const [suggestions, setSuggestions] = useState([]);
  // Declare cache outside of the useEffect to persist its state across renders
  const cache = {};

  useEffect(() => {
    // Debounce the fetchData function
    const debouncedFetchData = debounce(async () => {
      if (!searchTerm) {
        setSuggestions([]);
        return;
      }

      // Use cache key based on searchTerm and selectedCategory
      const cacheKey = `${searchTerm}-${selectedCategory}`;
      if (cache[cacheKey]) {
        setSuggestions(cache[cacheKey]);
        return;
      }

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

      try {
        const response = await axios.get(apiUrl);
        // Check if the response data is an array and slice it to limit to 5 results
        const limitedResults = Array.isArray(response.data) ? response.data.slice(0, 5) : [];
        setSuggestions(limitedResults);
        // Update the cache with new data
        cache[cacheKey] = limitedResults;
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    }, 500);

    debouncedFetchData();

    // Cleanup function to cancel the debounced call if component unmounts
    return () => {
      debouncedFetchData.cancel();
    };
  }, [searchTerm, selectedCategory]); // Dependencies are correctly listed

  // Function to fetch album information by ID (kept for future use)
  async function fetchAlbumInfo(albumId) {
    try {
      const response = await axios.get(`/albums/${albumId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching album info:', error);
      return null;
    }
  }


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
                {result.name} (Album) by {result.artistName}
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
    justifyContent: 'flex-start',
    height: '100vh',
    background: 'linear-gradient(to bottom, var(--prince-purple), var(--prince-black))',
    padding: '2rem',
    marginTop: '10vh',
    fontFamily: 'Poppins, sans-serif', // Use Poppins as the primary font

  },
  heading: {
    fontSize: '3rem',
    marginBottom: '1rem',
    fontFamily: 'Sniglet, cursive',
    color: 'var(--prince-yellow)'

  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '2rem',
    marginBottom: '1rem',
    background: 'rgba(106, 13, 173, 0.2)', // Lighter, semi-transparent purple
    borderRadius: '100px', 
    border: '1px solid white', 
    padding: '0.5rem 2rem', 
    fontFamily: 'Poppins, sans-serif', // Use Poppins as the primary font
   
  },
  select: {
    border: 'none',
    fontSize: '1.5rem',
    marginRight: '0.5rem',
    fontFamily: 'Sniglet, cursive',
    color: 'white',
    appearance: 'none',
    background: `transparent url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='${encodeURIComponent('rgba(255, 255, 255, 0.7)')}' d='M7 10l5 5 5-5z'/></svg>") no-repeat right 0.5rem top 50%`,
    padding: '2rem',
    cursor: 'pointer',
},

  input: {
    flex: 1,
    padding: '0.5rem',
    border: 'none',
    outline: 'none',
    fontSize: '1.2rem',
    marginRight: '1rem',
    backgroundColor: 'transparent', // Make input field background transparent
    color: 'rgba(255, 255, 255, 0.7)', // Soft white color for text
  },
  results: {
    listStyle: 'none',
    margin: '1rem 0',
    padding: 0,
  },
  resultItem: {
    margin: '.5rem 0',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    transition: 'color 0.3s ease',
  },
 
};


export default HomePage;