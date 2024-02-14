import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import LikedSongsForm from './LikedSongsForm';

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '20px',
    color: '#fff',
    fontFamily: 'Poppins, sans-serif',
  },
  trackImage: {
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    marginBottom: '20px',
  },
};

function TrackPage() {
  const { id } = useParams();
  const [trackInfo, setTrackInfo] = useState({});
  const [albumInfo, setAlbumInfo] = useState({});
  const [trackImage, setTrackImage] = useState('');
  const [artistId, setArtistId] = useState('');

  useEffect(() => {
    const fetchTrackData = async () => {
      try {
        const response = await axios.get(`/tracks/${id}`);
        setTrackInfo(response.data);
        const albumId = response.data.album.id;
        const albumResponse = await axios.get(`/albums/${albumId}`);
        setAlbumInfo(albumResponse.data);
        setTrackImage(response.data.album.images[0].url);
        setArtistId(response.data.artists[0].id);
      } catch (error) {
        console.error('Error fetching track data:', error);
      }
    };

    fetchTrackData();
  }, [id]);

  return (
    <div style={styles.container}>
      <h2>Track Details</h2>
      <p><strong>Name:</strong> {trackInfo.name}</p>
      <p><strong>Artist:</strong> <Link to={`/artist/${artistId}`}>{trackInfo.artists ? trackInfo.artists.map((artist) => artist.name).join(', ') : 'Unknown'}</Link></p>
      <p><strong>Album:</strong> {albumInfo.name || 'Unknown Album'}</p>
      <p><strong>Duration:</strong> {msToMinutesAndSeconds(trackInfo.duration_ms)}</p>
      {trackImage && <img src={trackImage} alt={`Cover for ${trackInfo.name}`} style={styles.trackImage} />}
      {albumInfo.id && (
        <p><strong>Album:</strong> <Link to={`/albums/${albumInfo.id}`}>{albumInfo.name}</Link></p>
      )}
      {trackInfo.id && (
        <LikedSongsForm 
          trackId={trackInfo.id} 
          trackInfo={{
            name: trackInfo.name,
            artists: trackInfo.artists.map(artist => ({ name: artist.name })),
            album: albumInfo.name
          }}
        />
      )}
    </div>
  );
}

function msToMinutesAndSeconds(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export default TrackPage;
