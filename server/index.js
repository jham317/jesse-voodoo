const express = require('express');
const session = require('express-session');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectToDatabase } = require('./Database/database');
const artistRoutes = require('./Controllers/artistsController');
const albumRoutes = require('./Controllers/albumController');
const trackRoutes = require('./Controllers/tracksController');
const { registerUser, loginUser } = require('./Handlers/AuthHandler');
const { postReview } = require('./Handlers/ReviewHandler');
const authenticateToken = require('./middleware/authenticateToken');

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to the database
connectToDatabase()
  .then(async () => {
    // Set up routes

    app.post('/register', registerUser);
app.post('/login', loginUser);

app.post('/reviews', authenticateToken, postReview);

   
    app.use('/artists', artistRoutes);
    app.use('/albums', albumRoutes);
    app.use('/tracks', trackRoutes);

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1); // Exit the process if database connection fails
  });
