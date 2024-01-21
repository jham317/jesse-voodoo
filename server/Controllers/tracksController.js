const express = require('express');
const axios = require('axios');
const { getSpotifyAccessToken } = require('../spotifyAuth');
const app = express();

// Route handler for fetching track information by ID
app.get('/:id', async (req, res, next) => {
  try {
    // Get the track ID from the request parameters
    const trackId = req.params.id;

    // Get the Spotify access token
    const accessToken = await getSpotifyAccessToken();

    // Spotify API endpoint URL for fetching track information by ID
    const spotifyApiUrl = `https://api.spotify.com/v1/tracks/${trackId}`;

    // Make the API request to Spotify with the access token in the Authorization header
    const response = await axios.get(spotifyApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Extract and send the track data in the response
    const trackData = response.data;

    res.status(200).json(trackData);
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
});

module.exports = app;
