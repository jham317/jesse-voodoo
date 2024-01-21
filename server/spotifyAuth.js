const axios = require('axios');
require('dotenv').config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

async function getSpotifyAccessToken() {
  const tokenUrl = 'https://accounts.spotify.com/api/token';

  try {
    const response = await axios.post(
      tokenUrl,
      'grant_type=client_credentials',
      {
        auth: {
          username: clientId,
          password: clientSecret,
        },
      }
    );

    const accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error('Error fetching Spotify access token:', error);
    throw error;
  }
}

module.exports = { getSpotifyAccessToken };
