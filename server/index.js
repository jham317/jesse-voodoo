const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./Database/database');
const artistRoutes = require('./Controllers/artistsController');
const musicRoutes = require('./Controllers/musicController');
const trackRoutes = require('./Controllers/tracksController');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

connectToDatabase()
  .then((database) => {
    app.use('/artists', artistRoutes);
    app.use('/music', musicRoutes);
    app.use('/tracks', trackRoutes);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });
