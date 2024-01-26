import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ArtistPage() {
  const { id } = useParams();
  const [artistInfo, setArtistInfo] = useState({});
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loadingTopTracks, setLoadingTopTracks] = useState(true); // Added loading state

  useEffect(() => {
    const artistId = id;

    axios.get(`/artists/${artistId}`)
      .then((response) => {
        setArtistInfo(response.data);
      })
      .catch((error) => {
        console.error('Error fetching artist info:', error);
      });

    axios.get(`/artists/${artistId}/top-tracks`)
      .then((response) => {
        setTopTracks(response.data);
        setLoadingTopTracks(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        console.error('Error fetching top tracks:', error);
        setLoadingTopTracks(false); // Set loading to false in case of an error
      });

    axios.get(`/artists/${artistId}/albums`)
      .then((response) => {
        setAlbums(response.data.items);
      })
      .catch((error) => {
        console.error('Error fetching artist albums:', error);
      });
  }, [id]);

  return (
    <div>
      {/* Display artist information */}
      <h2>{artistInfo.name}</h2>
      {artistInfo.images && artistInfo.images.length > 0 ? (
        <img src={artistInfo.images[0].url} alt={`${artistInfo.name} Image`} />
      ) : (
        <p>No artist image available</p>
      )}
      {/* Display top tracks */}
      <h3>Top Tracks</h3>
      {loadingTopTracks ? ( // Show a loading message while data is being fetched
        <p>Loading top tracks...</p>
      ) : (
        <ul>
          {Array.isArray(topTracks) ? ( // Check if topTracks is an array before mapping
            topTracks.map((track) => (
              <li key={track.id}>{track.name}</li>
            ))
          ) : (
            <p>No top tracks available</p>
          )}
        </ul>
      )}
      {/* Display albums */}
      <h3>Albums</h3>
      <ul>
        {albums.map((album) => (
          <li key={album.id}>
            {album.images && album.images.length > 0 ? (
              <img src={album.images[0].url} alt={`${album.name} Image`} />
            ) : (
              <p>No album image available</p>
            )}
            <span>{album.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ArtistPage;

