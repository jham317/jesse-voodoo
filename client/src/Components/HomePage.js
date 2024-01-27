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
            const albumIds = response.data
              .filter((result) => result.type === 'album')
              .map((result) => result.id);

            // Fetch album information for all album search results
            const albumInfoPromises = albumIds.map(fetchAlbumInfo);

            // Wait for all album info requests to complete
            const albumInfos = await Promise.all(albumInfoPromises);

            // Create a map of album IDs to artist names
            const albumIdToArtistName = {};
            albumInfos.forEach((albumInfo, index) => {
              if (albumInfo) {
                albumIdToArtistName[albumIds[index]] = albumInfo.artistName || 'Unknown Artist';
              }
            });

            // Format suggestions and add artist names for albums
            const formattedSuggestions = response.data.map((result) => {
              if (result.type === 'album') {
                return {
                  ...result,
                  artistName: albumIdToArtistName[result.id],
                };
              }
              return result;
            });

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
    justifyContent: 'flex-start', // Adjust to move content to the top
    height: '100vh', // Set height to 100vh
    background: 'linear-gradient(to bottom, var(--prince-purple), var(--prince-black))', // Example gradient background
    padding: '2rem', // Add padding for spacing
    marginTop: '20vh', // Adjust marginTop for content position
  },
  heading: {
    fontSize: '3rem', // Increase font size for heading
    marginBottom: '1rem',
    fontFamily: 'Sniglet, cursive', // Use custom font
    color: 'var(--prince-yellow)', // Text color
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem', // Adjust marginBottom for search area position
    background: 'white', // Background color for the search bar
    borderRadius: '20px', // Rounded corners
    padding: '1rem', // Add padding to the search bar
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)', // Box shadow for depth
  },
  input: {
    flex: 1, // Expand input field to fill available space
    padding: '0.5rem',
    border: 'none',
    outline: 'none', // Remove outline on focus
    fontSize: '1.2rem', // Adjust font size
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: 'var(--prince-purple)', // Button background color
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    marginLeft: '1rem', // Add spacing between input and button
    transition: 'background-color 0.3s ease', // Smooth background color transition
  },
  buttonHover: {
    backgroundColor: 'var(--prince-yellow)', // Change background color on hover
  },
  results: {
    listStyle: 'none',
    margin: '0.5rem 0', // Adjust margin for suggestions position
    padding: 0,
  },
  resultItem: {
    margin: '0.5rem 0',
  },
  link: {
    textDecoration: 'none',
    color: 'white', // Change link text color to white
    transition: 'color 0.3s ease', // Smooth color transition on hover
  },
  linkHover: {
    color: 'var(--prince-yellow)', // Change link color on hover
  },
};


export default HomePage;
