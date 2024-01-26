const express = require('express');
const axios = require('axios');
const { getSpotifyAccessToken } = require('../spotifyAuth');
const app = express();

// Reusable function to make Spotify API requests
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

// Route handler for searching artists by name
app.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.query;
    console.log('Search query:', searchQuery); 
    const accessToken = await getSpotifyAccessToken();

    const spotifySearchUrl = `https://api.spotify.com/v1/search?q=${searchQuery}&type=artist`;
    const searchResponse = await axios.get(spotifySearchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const artistResults = searchResponse.data.artists.items;

    if (artistResults.length === 0) {
      res.status(200).json({ message: 'No artists found' });
    } else {
      res.status(200).json(artistResults);
    }
    } catch (error) {
    console.error('Error searching for artists:', error);
    res.status(500).json({ error: 'Failed to search for artists' });
  }
});

// Route handler for fetching artist information by ID
app.get('/:id', async (req, res) => {
  try {
    const artistId = req.params.id;
    const accessToken = await getSpotifyAccessToken();
    const spotifyApiUrl = `https://api.spotify.com/v1/artists/${artistId}`;
    const artistData = await fetchSpotifyData(spotifyApiUrl, accessToken);

    res.status(200).json(artistData);
  } catch (error) {
    console.error('Error fetching artist data from Spotify:', error);
    res.status(500).json({ error: 'Failed to fetch artist data from Spotify' });
  }
});

// Route handler for fetching artist's albums by ID
app.get('/:id/albums', async (req, res) => {
  try {
    const artistId = req.params.id;
    const accessToken = await getSpotifyAccessToken();
    const spotifyApiUrl = `https://api.spotify.com/v1/artists/${artistId}/albums`;
    const artistAlbumsData = await fetchSpotifyData(spotifyApiUrl, accessToken);

    res.status(200).json(artistAlbumsData);
  } catch (error) {
    console.error('Error fetching artist albums from Spotify:', error);
    res.status(500).json({ error: 'Failed to fetch artist albums from Spotify' });
  }
});



module.exports = app;
