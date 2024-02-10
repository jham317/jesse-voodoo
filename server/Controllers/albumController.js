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

// Route handler for searching albums by name with a limit of 5 albums
router.get('/search', async (req, res) => {
  try {
    const searchQuery = encodeURIComponent(req.query.query);
    const accessToken = await getSpotifyAccessToken();
    // Enforce a limit of 5 albums to be fetched at a time
    const limit = 5; // Limit the number of results to 5

    // Spotify API endpoint URL for searching albums by name with a limit
    const spotifySearchUrl = `https://api.spotify.com/v1/search?q=${searchQuery}&type=album&limit=${limit}`;

    const searchResponse = await fetchSpotifyData(spotifySearchUrl, accessToken);

    const albums = searchResponse.albums.items;

    if (albums.length === 0) {
      res.status(200).json({ message: 'No albums found' });
    } else {
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
router.get('/:id', async (req, res) => {
  try {
    const albumId = req.params.id;
    const accessToken = await getSpotifyAccessToken();
    const spotifyApiUrl = `https://api.spotify.com/v1/albums/${albumId}`;
    const albumData = await fetchSpotifyData(spotifyApiUrl, accessToken);

    if (albumData.artists && albumData.artists.length > 0) {
      albumData.artistName = albumData.artists[0].name;
    } else {
      albumData.artistName = 'Unknown Artist';
    }

    res.status(200).json(albumData);
  } catch (error) {
    console.error('Error fetching album data from Spotify:', error);
    res.status(500).json({ error: 'Failed to fetch album data from Spotify' });
  }
});

// Route handler for fetching tracks of an album by ID, handling pagination if more than 5 tracks
router.get('/:id/tracks', async (req, res) => {
  try {
    const albumId = req.params.id;
    const accessToken = await getSpotifyAccessToken();
    const limit = 20; // Limit the number of tracks fetched to 5
    const spotifyApiUrl = `https://api.spotify.com/v1/albums/${albumId}/tracks?limit=${limit}`;

    const response = await fetchSpotifyData(spotifyApiUrl, accessToken);

    res.status(200).json(response.items);
  } catch (error) {
    console.error('Error fetching album tracks from Spotify:', error);
    res.status(500).json({ error: 'Failed to fetch album tracks from Spotify' });
  }
});

module.exports = router;
