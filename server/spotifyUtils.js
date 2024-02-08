// spotifyUtils.js
const axios = require('axios');

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

module.exports = {
  fetchSpotifyData,
};
