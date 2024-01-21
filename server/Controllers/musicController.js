const express = require('express');
const axios = require('axios');
const { getSpotifyAccessToken } = require('../spotifyAuth');
const app = express();

// Route handler for fetching album information by ID
app.get('/albums/:id', async (req, res) => {
  try {
    // Get the album ID from the request parameters
    const albumId = req.params.id;

    // Get the Spotify access token
    const accessToken = await getSpotifyAccessToken();

    // Spotify API endpoint URL for fetching album information by ID
    const spotifyApiUrl = `https://api.spotify.com/v1/albums/${albumId}`;

    // Make the API request to Spotify with the access token in the Authorization header
    const response = await axios.get(spotifyApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Extract and send the album data in the response
    const albumData = response.data;

    res.status(200).json(albumData);
  } catch (error) {
    console.error('Error fetching album data from Spotify:', error);
    res.status(500).json({ error: 'Failed to fetch album data from Spotify' });
  }
});

// Route handler for fetching tracks of an album by ID
app.get('/albums/:id/tracks', async (req, res) => {
  try {
    const albumId = req.params.id;
    const accessToken = await getSpotifyAccessToken();

    // Spotify API endpoint URL for fetching tracks of an album
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

// Route handler for fetching new releases
app.get('/new-releases', async (req, res) => {
  try {
    const accessToken = await getSpotifyAccessToken();

    // Query parameters for limiting and offsetting the results
    const limit = req.query.limit || 10; // Default to 10 if not specified
    const offset = req.query.offset || 0; // Default to 0 if not specified
    const country = req.query.country || 'SE'; // Default country code

    // Spotify API endpoint URL for fetching new releases with limit, offset, and country
    const spotifyApiUrl = `https://api.spotify.com/v1/browse/new-releases?limit=${limit}&offset=${offset}&country=${country}`;

    const response = await axios.get(spotifyApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const newReleasesData = response.data;

    res.status(200).json(newReleasesData);
  } catch (error) {
    console.error('Error fetching new releases from Spotify:', error);
    res.status(500).json({ error: 'Failed to fetch new releases from Spotify' });
  }
});

module.exports = app;
