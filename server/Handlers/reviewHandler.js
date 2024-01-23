const fs = require('fs');
const reviewsDataPath = './database/reviews.json';

// Helper function to read reviews data from JSON file
function readReviewsData() {
  const data = fs.readFileSync(reviewsDataPath);
  return JSON.parse(data);
}

// Helper function to write reviews data to JSON file
function writeReviewsData(reviews) {
  fs.writeFileSync(reviewsDataPath, JSON.stringify(reviews, null, 2));
}

// Get all reviews
function getAllReviews(req, res) {
  const reviews = readReviewsData();
  res.json(reviews);
}

// Create a new review
function createReview(req, res) {
  const reviews = readReviewsData();
  const newReview = {
    userId: req.body.userId || '',
    trackId: req.body.trackId || '',
    albumId: req.body.albumId || '',
    title: req.body.title || '',
    content: req.body.content || '',
    createdAt: new Date(),
  };

  reviews.push(newReview);
  writeReviewsData(reviews);

  res.status(201).json(newReview);
}

module.exports = {
  getAllReviews,
  createReview,
};
