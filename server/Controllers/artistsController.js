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

// Route handler for searching artists by name with a limit of 5 artists
app.get('/search', async (req, res) => {
  try {
    const searchQuery = encodeURIComponent(req.query.query);
    console.log('Search query:', searchQuery);
    const accessToken = await getSpotifyAccessToken();
    // Enforce a limit of 5 artists to be fetched at a time
    const limit = 5;

    const spotifySearchUrl = `https://api.spotify.com/v1/search?q=${searchQuery}&type=artist&limit=${limit}`;
    const searchResponse = await fetchSpotifyData(spotifySearchUrl, accessToken);

    const artistResults = searchResponse.artists.items;

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

// Route handler for fetching an artist's albums by ID with a limit of 5 albums
app.get('/:id/albums', async (req, res) => {
  try {
    const artistId = req.params.id;
    const accessToken = await getSpotifyAccessToken();
    // Enforce a limit of 5 albums to be fetched at a time
    const limit = 5;
    const spotifyApiUrl = `https://api.spotify.com/v1/artists/${artistId}/albums?limit=${limit}`;

    const artistAlbumsData = await fetchSpotifyData(spotifyApiUrl, accessToken);

    res.status(200).json(artistAlbumsData);
  } catch (error) {
    console.error('Error fetching artist albums from Spotify:', error);
    res.status(500).json({ error: 'Failed to fetch artist albums from Spotify' });
  }
});

module.exports = app;
