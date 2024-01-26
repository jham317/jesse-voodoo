import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ArtistPage() {
  const { id } = useParams();
  const [artistInfo, setArtistInfo] = useState({});
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const artistId = id;

    axios.get(`/artists/${artistId}`)
      .then((response) => {
        setArtistInfo(response.data);
      })
      .catch((error) => {
        console.error('Error fetching artist info:', error);
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
        <img src={artistInfo.images[0].url} alt={`${artistInfo.name}`} />
      ) : (
        <p>No artist image available</p>
      )}

      {/* Display albums */}
      <h3>Albums</h3>
      <ul>
        {albums.map((album) => (
          <li key={album.id}>
            {album.images && album.images.length > 0 ? (
             <img src={artistInfo.images[0].url} alt={`${artistInfo.name}`} />
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
