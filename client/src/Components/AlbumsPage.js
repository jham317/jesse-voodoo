import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function AlbumsPage() {
  const { albumId } = useParams();
  const [albumDetails, setAlbumDetails] = useState({});
  const [tracklist, setTracklist] = useState([]);

  useEffect(() => {
    // Fetch album details by albumId
    axios.get(`/albums/${albumId}`)
      .then((response) => {
        const albumData = response.data;

        // Accessing artist name, release date, and cover image URL
        const artistName = albumData.artists.map((artist) => artist.name).join(', ');
        const releaseDate = albumData.release_date;
        const coverImageUrl = albumData.images[0].url;

        // Set album details in the state
        setAlbumDetails({
          name: albumData.name,
          artist: artistName,
          releaseDate: releaseDate,
          imageUrl: coverImageUrl,
        });
      })
      .catch((error) => {
        console.error('Error fetching album details:', error);
        setAlbumDetails({});
      });

    // Fetch tracklist for the album
    axios.get(`/albums/${albumId}/tracks`)
      .then((response) => {
        setTracklist(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tracklist:', error);
        setTracklist([]);
      });
  }, [albumId]);

  return (
    <div>
      <h1>Album Details</h1>
      <h2>{albumDetails.name}</h2>
      <p>Artist: {albumDetails.artist}</p>
      <p>Release Date: {albumDetails.releaseDate}</p>
      <img src={albumDetails.imageUrl} alt={`Cover for ${albumDetails.name}`} />

      <h2>Tracklist</h2>
      <ul>
        {tracklist.map((track) => (
          <li key={track.id}>{track.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default AlbumsPage;
