// Import necessary modules
const express = require('express');
const axios = require('axios');
const { getSpotifyAccessToken } = require('../spotifyAuth');
const router = express.Router();

async function fetchSpotifyData(endpoint, accessToken) {
  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

// Route handler for searching albums by name
router.get('/search', async (req, res) => {
  try {
    const searchQuery = encodeURIComponent(req.query.query);
    const accessToken = await getSpotifyAccessToken();

    // Spotify API endpoint URL for searching albums by name
    const spotifySearchUrl = `https://api.spotify.com/v1/search?q=${searchQuery}&type=album`;

    const searchResponse = await axios.get(spotifySearchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const albums = searchResponse.data.albums.items;

    console.log('Search Query:', searchQuery);
    console.log('Albums:', albums); // Debugging line

    if (albums.length === 0) {
      res.status(200).json({ message: 'No albums found' });
    } else {
      // Map the albums to match the format of the /artists/search response
      const formattedAlbums = albums.map(album => ({
        id: album.id,
        name: album.name,
        type: 'album',
        artistName: album.artists.map((artist) => artist.name).join(', '), // Include artist name
      }));

      res.status(200).json(formattedAlbums);
    }
  } catch (error) {
    console.error('Error searching for albums:', error);
    res.status(500).json({ error: 'Failed to search for albums' });
  }
});

  

// Route handler for fetching album information by ID
// Route handler for fetching album information by ID
router.get('/:id', async (req, res) => {
  try {
    const albumId = req.params.id;
    const accessToken = await getSpotifyAccessToken();
    const spotifyApiUrl = `https://api.spotify.com/v1/albums/${albumId}`;
    const albumData = await fetchSpotifyData(spotifyApiUrl, accessToken);

  // Check if the album has artists associated with it
if (albumData.artists && albumData.artists.length > 0) {
  // Access the first artist's name 
  albumData.artistName = albumData.artists[0].name;
} else {
  // If no artists are associated with the album, set a default value
  albumData.artistName = 'Unknown Artist';
}

    res.status(200).json(albumData);
  } catch (error) {
    console.error('Error fetching album data from Spotify:', error);
    res.status(500).json({ error: 'Failed to fetch album data from Spotify' });
  }
});
// Route handler for fetching tracks of an album by ID
router.get('/:id/tracks', async (req, res) => {
  try {
    const albumId = req.params.id;
    const accessToken = await getSpotifyAccessToken();
    const spotifyApiUrl = `https://api.spotify.com/v1/albums/${albumId}/tracks`;
    const response = await axios.get(spotifyApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const tracksData = response.data.items;

    res.status(200).json(tracksData);
  } catch (error) {
    console.error('Error fetching album tracks from Spotify:', error);
    res.status(500).json({ error: 'Failed to fetch album tracks from Spotify' });
  }
});

module.exports = router;
