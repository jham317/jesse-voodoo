const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../Database/database');

exports.addLikedSong = async (req, res) => {
    const userId = req.user.userId; // Assuming JWT middleware sets req.user
    const { trackId, trackInfo } = req.body;
  
    if (!userId || !trackId || !trackInfo) {
      return res.status(400).send('User ID, Track ID, and track information are required.');
    }
  
    try {
        const db = await connectToDatabase();
      const likedSongsCollection = db.collection('likedSongs');
  
      const likedSong = {
        userId: new ObjectId(userId),
        trackId,
        trackInfo, // Make sure this contains the expected structure
        createdAt: new Date(),
      };
  
      await likedSongsCollection.insertOne(likedSong);
      res.status(201).send('Song liked successfully.');
    } catch (error) {
      console.error('Failed to add liked song:', error);
      res.status(500).send('Server error: ' + error.message);
    }
  };
  exports.fetchLikedSongs = async (req, res) => {
    const userId = req.user.userId; // Assuming JWT middleware sets req.user
  
    try {
        const db = await connectToDatabase();
        const likedSongsCollection = db.collection('likedSongs');
  
        const userLikedSongs = await likedSongsCollection.find({ userId: new ObjectId(userId) }).toArray();
  
        res.status(200).json(userLikedSongs);
    } catch (error) {
        console.error('Failed to fetch user liked songs:', error);
        res.status(500).send('Server error: ' + error.message);
    }
};

exports.deleteLikedSong = async (req, res) => {
    const userId = req.user.userId; // Assuming JWT middleware sets req.user
    const trackId = req.params.id; // Use req.params.id to get the trackId
  
    if (!userId || !trackId) {
      return res.status(400).send('User ID and Track ID are required.');
    }
  
    try {
      const db = await connectToDatabase();
      const likedSongsCollection = db.collection('likedSongs');
  
      // Delete the liked song by userId and trackId
      await likedSongsCollection.deleteOne({ userId: new ObjectId(userId), trackId: trackId });
      res.status(200).send('Song unliked successfully.');
    } catch (error) {
      console.error('Failed to unlike song:', error);
      res.status(500).send('Server error: ' + error.message);
    }
};