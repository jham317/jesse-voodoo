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

// Route handler for searching tracks by name
app.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.query;
    const accessToken = await getSpotifyAccessToken();

    const spotifySearchUrl = `https://api.spotify.com/v1/search?q=${searchQuery}&type=track`;
    const searchResponse = await axios.get(spotifySearchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const tracks = searchResponse.data.tracks.items;

    if (tracks.length === 0) {
      res.status(200).json({ message: 'No tracks found' });
    } else {
      res.status(200).json(tracks);
    }
  } catch (error) {
    console.error('Error searching for tracks:', error);
    res.status(500).json({ error: 'Failed to search for tracks' });
  }
});

// Route handler for fetching track information by ID
app.get('/:id', async (req, res) => {
  try {
    const trackId = req.params.id;
    const accessToken = await getSpotifyAccessToken();
    const spotifyApiUrl = `https://api.spotify.com/v1/tracks/${trackId}`;
    const trackData = await fetchSpotifyData(spotifyApiUrl, accessToken);

    res.status(200).json(trackData);
  } catch (error) {
    console.error('Error fetching track data from Spotify:', error);
    res.status(500).json({ error: 'Failed to fetch track data from Spotify' });
  }
});

module.exports = app;
