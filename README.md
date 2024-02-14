# jesse-voodoo


Voodoo Music Album Explorer
Voodoo is a web application designed for music enthusiasts to discover, explore, and interact with their favorite albums and artists. The project aims to provide a user-friendly platform for users to search for albums, leave reviews, create playlists, and receive personalized recommendations.

Features
User Authentication: Users can register and login to the platform to access personalized features.
Album Search and Browse: Users can search for albums by artist, album title, or by track and browse through featured albums and latest releases.
Album Details: Detailed album information is provided, including album cover, artist name, release date, tracklist, and additional data.
User Reviews and Ratings: Users can leave reviews and ratings for albums which are showcased in a ranked order by highest to lowest or by date reviewed.

Layout
Home Page search Bar: Filter through data by artist, album title, or track.
Albums Page: View detailed information about albums with images with tracklist and rating form, if user has rated already it will show their rating which has been stored on mongodb.
TrackPage/Artist page show both sets of data. Track Page has ability to like the track which sends it to Liked Songs page with fetches users liked songs from local Mongo database.
Goals moving forward:
User Profile Page: Information on the user's favorite albums, reviews, and interactions.
Playlist Page based on liked songs: Create and manage playlists linked to Spotify.
Main App and Server Files
App Router (React)
The AppRouter.js file manages the routing and navigation within the React application. It includes routes for different pages such as login, signup, home, albums, artists, user profile, tracks, user reviews, and liked songs.

Backend Server (Node.js & Express.js)
The index.js file sets up the backend server using Express.js. It handles user authentication, database connections, and routes for various functionalities such as user registration, login, album reviews, liked songs, and other CRUD operations for albums, artists, and tracks.

RESTful Endpoint Approach
The backend server follows a RESTful endpoint approach by organizing routes and resources according to REST principles. Each route corresponds to a specific resource (e.g., albums, artists, tracks), and HTTP methods (GET, POST, PUT, DELETE) are used to perform CRUD operations on these resources. For example:

GET /albums: Retrieve all albums.
POST /albums: Create a new album.
PUT /albums/:id: Update an existing album.
DELETE /albums/:id: Delete an album by ID.
Similarly, other routes follow a similar pattern for managing users, reviews, liked songs, etc., adhering to RESTful conventions.

