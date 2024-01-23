const fs = require('fs');
const ratingsDataPath = './database/ratings.json';

function readRatingsData() {
  const data = fs.readFileSync(ratingsDataPath);
  return JSON.parse(data);
}

function getAllRatings(req, res) {
  const ratings = readRatingsData();
  res.json(ratings);
}

function createRating(req, res) {
  // Implement logic to create a new rating and save it to the JSON file
  // Then respond with the created rating
}

module.exports = {
  getAllRatings,
  createRating,
};
