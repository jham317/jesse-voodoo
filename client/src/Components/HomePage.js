import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);

  useEffect(() => {
    // Fetch autocomplete suggestions based on the search term from your backend
    if (searchTerm) {
      axios.get(`/artists/search?query=${searchTerm}`)
        .then((response) => {
          setSuggestions(response.data);
        })
        .catch((error) => {
          console.error('Error fetching suggestions:', error);
        });
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSearch = () => {
    // Perform a search for the selected artist when the user clicks or selects from suggestions
    if (selectedArtist) {
      axios.get(`/artists/${selectedArtist.id}`)
        .then((response) => {
          console.log('Artist details:', response.data);
          // Handle displaying artist details or navigating to the artist's page
        })
        .catch((error) => {
          console.error('Error fetching artist details:', error);
        });
    }
  };

  return (
    <div>
      <h1>Search for Artists</h1>
      <input
        type="text"
        placeholder="Search by artist name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {suggestions.map((artist) => (
          <li key={artist.id} onClick={() => setSelectedArtist(artist)}>
            {artist.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
