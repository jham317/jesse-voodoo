const express = require('express');
const axios = require('axios');
const { getSpotifyAccessToken } = require('../spotifyAuth');
const app = express();

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

// Route handler for searching tracks by name with a limit of 5 tracks
app.get('/search', async (req, res) => {
  try {
    const searchQuery = encodeURIComponent(req.query.query);
    const accessToken = await getSpotifyAccessToken();
    // Enforce a limit of 5 tracks to be fetched at a time
    const limit = 5;

    const spotifySearchUrl = `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=${limit}`;
    const searchResponse = await fetchSpotifyData(spotifySearchUrl, accessToken);

    const tracks = searchResponse.tracks.items;

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
