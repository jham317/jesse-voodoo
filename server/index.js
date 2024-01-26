const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectToDatabase } = require('./Database/database');
const artistRoutes = require('./Controllers/artistsController');
const albumController = require('./Controllers/albumController');
const trackRoutes = require('./Controllers/tracksController');
const { insertDataIntoCollection } = require('./Database/insertCollections');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

connectToDatabase()
  .then(async (database) => {
    // Import and use handlers for user-related collections
    const { getAllUsers, createUser } = require('./Handlers/userHandler');
    const { getAllRatings, createRating } = require('./Handlers/ratingsHandler');
    const { getAllReviews, createReview } = require('./Handlers/reviewHandler');
    const { getAllUserProfiles, updateUserProfile } = require('./Handlers/userProfileHandler');

    // Import and insert data into each collection
    const collectionsToInsert = [
      { name: 'users', data: require('./Database/user.json') },
      { name: 'ratings', data: require('./Database/ratings.json') },
      { name: 'reviews', data: require('./Database/reviews.json') },
      { name: 'userProfiles', data: require('./Database/userProfiles.json') },
      // Add more collections as needed
    ];

    for (const collectionInfo of collectionsToInsert) {
      await insertDataIntoCollection(collectionInfo.name, collectionInfo.data);
    }

    // Set up routes for each collection using the appropriate handlers
    app.get('/users', getAllUsers);
    app.post('/users', createUser);

    app.get('/ratings', getAllRatings);
    app.post('/ratings', createRating);

    app.get('/reviews', getAllReviews);
    app.post('/reviews', createReview);

    app.get('/userProfiles', getAllUserProfiles);
    app.put('/userProfiles/:userId', updateUserProfile);

    // Use other routes as needed (e.g., artistRoutes, musicRoutes, trackRoutes)
    app.use('/artists', artistRoutes);
    app.use('/albums', albumController);
    app.use('/tracks', trackRoutes);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });
