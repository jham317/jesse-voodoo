const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../Database/database');

exports.postReview = async (req, res) => {
    const { albumId, reviewText, rating } = req.body;
    // Assuming the JWT middleware has added the user info to req.user
    const userId = req.user.userId;

    // Validate input
    if (!albumId || rating === undefined) {
        return res.status(400).send('Album ID and rating are required.');
    }

    try {
        const db = await connectToDatabase();
        const reviewsCollection = db.collection('reviews');

        // Insert the review into the database
        const review = {
            albumId,
            userId: new ObjectId(userId), // Ensure userId matches the type stored in your database
            reviewText,
            rating,
            createdAt: new Date(),
        };
        await reviewsCollection.insertOne(review);

        res.status(201).send('Review added successfully.');
    } catch (error) {
        console.error('Failed to post review:', error);
        res.status(500).send('Server error: ' + error.message);
    }
};
