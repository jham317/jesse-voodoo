const express = require('express');
const axios = require('axios');
const { getSpotifyAccessToken } = require('../spotifyAuth');
const app = express();

// Route handler for fetching artist information by ID
app.get('/:id', async (req, res) => {
  try {
    // Get the artist ID from the request parameters
    const artistId = req.params.id;

    // Get the Spotify access token
    const accessToken = await getSpotifyAccessToken();

    // Spotify API endpoint URL for fetching artist information by ID
    const spotifyApiUrl = `https://api.spotify.com/v1/artists/${artistId}`;

    // Make the API request to Spotify with the access token in the Authorization header
    const response = await axios.get(spotifyApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Extract and send the artist data in the response
    const artistData = response.data;

    res.status(200).json(artistData);
  } catch (error) {
    console.error('Error fetching artist data from Spotify:', error);
    res.status(500).json({ error: 'Failed to fetch artist data from Spotify' });
  }
});

// Route handler for fetching artist's albums by ID
app.get('/:id/albums', async (req, res) => {
  try {
    // Get the artist ID from the request parameters
    const artistId = req.params.id;

    // Get the Spotify access token
    const accessToken = await getSpotifyAccessToken();

    // Spotify API endpoint URL for fetching artist's albums by ID
    const spotifyApiUrl = `https://api.spotify.com/v1/artists/${artistId}/albums`;

    // Make the API request to Spotify with the access token in the Authorization header
    const response = await axios.get(spotifyApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Extract and send the artist's albums data in the response
    const artistAlbumsData = response.data;

    res.status(200).json(artistAlbumsData);
  } catch (error) {
    console.error('Error fetching artist albums from Spotify:', error);
    res.status(500).json({ error: 'Failed to fetch artist albums from Spotify' });
  }
});

// Route handler for fetching artist's top tracks by ID
app.get('/:id/top-tracks', async (req, res) => {
  try {
    // Get the artist ID from the request parameters
    const artistId = req.params.id;

    // Get the Spotify access token
    const accessToken = await getSpotifyAccessToken();

    // Spotify API endpoint URL for fetching artist's top tracks by ID
    const spotifyApiUrl = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`; // Added country parameter

    // Make the API request to Spotify with the access token in the Authorization header
    const response = await axios.get(spotifyApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Extract and send the artist's top tracks data in the response
    const artistTopTracksData = response.data;

    res.status(200).json(artistTopTracksData);
  } catch (error) {
    console.error('Error fetching artist top tracks from Spotify:', error);
    res.status(500).json({ error: 'Failed to fetch artist top tracks from Spotify' });
  }
});

module.exports = app;
