import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('artist'); // Default to searching artists
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [tracklist, setTracklist] = useState([]);

  useEffect(() => {
    if (searchTerm) {
      // Define the appropriate API endpoint based on the selected category
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

      axios.get(apiUrl)
        .then((response) => {
          // Ensure that the response data is an array before setting suggestions
          if (Array.isArray(response.data)) {
            setSuggestions(response.data);
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

  const handleSearch = (albumId) => {
    // Handle searching for artists, albums, and tracks
    // You can use the selectedCategory state to determine the type of search
    // For example, you can redirect to the corresponding page based on the selection
    switch (selectedCategory) {
      case 'artist':
        // Redirect to artist search results page
        // Example: history.push(`/search/artists?query=${searchTerm}`);
        break;
      case 'album':
        // Set the selectedAlbumId when an album suggestion is clicked
        setSelectedAlbumId(albumId);
        // Fetch the tracklist for the selected album using albumId
        axios.get(`/albums/${albumId}/tracks`)
          .then((response) => {
            setTracklist(response.data);
          })
          .catch((error) => {
            console.error('Error fetching tracklist:', error);
            setTracklist([]);
          });
        break;
      case 'track':
        // Redirect to track search results page
        // Example: history.push(`/search/tracks?query=${searchTerm}`);
        break;
      default:
        break;
    }
  };

  // Reset selectedAlbumId and tracklist when searchTerm or selectedCategory changes
  useEffect(() => {
    setSelectedAlbumId(null);
    setTracklist([]);
  }, [searchTerm, selectedCategory]);

  return (
    <div>
      <h1>Search for Music</h1>
      <div>
        <input
          type="text"
          placeholder="Enter your search query"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option value="artist">Artists</option>
          <option value="album">Albums</option>
          <option value="track">Tracks</option>
        </select>
        <button onClick={() => handleSearch(selectedAlbumId)}>Search</button>
      </div>
      <ul>
        {suggestions.map((result) => (
          <li key={result.id}>
            {result.type === 'artist' ? (
              <Link to={`/artist/${result.id}`}>
                {result.name}
              </Link>
            ) : result.type === 'album' ? (
              <Link to={`/albums/${result.id}`}>
  {result.name}
</Link>
            ) : result.type === 'track' ? (
              <Link to={`/album/${result.albumId}`}>
                {result.name}
              </Link>
            ) : (
              <span>{result.name}</span>
            )}
          </li>
        ))}
      </ul>
      {selectedAlbumId && (
        <div>
          <h2>Album Details</h2>
          {/* Display album details here */}
          <h2>Tracklist</h2>
          <ul>
            {tracklist.map((track) => (
              <li key={track.id}>
                {track.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default HomePage;
