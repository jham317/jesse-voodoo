const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../Database/database');

exports.postReview = async (req, res) => {
    const { albumId, reviewText, rating, strength } = req.body; // Include strength here
    const userId = req.user.userId;

    if (!albumId || rating === undefined || !strength) { // Also validate strength
        return res.status(400).send('Album ID, rating, and strength are required.');
    }

    try {
        const db = await connectToDatabase();
        const reviewsCollection = db.collection('reviews');

        const review = {
            albumId,
            userId: new ObjectId(userId),
            reviewText,
            strength, // Now strength is defined
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

exports.fetchUserReviews = async (req, res) => {
    // Assuming the JWT middleware has already validated the user and attached the userId to req.user
    const userId = req.user.userId;

    try {
        const db = await connectToDatabase();
        const reviewsCollection = db.collection('reviews');

        const userReviews = await reviewsCollection.find({ userId: new ObjectId(userId) }).toArray();

        res.status(200).json(userReviews);
    } catch (error) {
        console.error('Failed to fetch user reviews:', error);
        res.status(500).send('Server error: ' + error.message);
    }
   
    
};
exports.updateReview = async (req, res) => {
    const { id } = req.params;
    const { rating, reviewText, strength } = req.body;
    const userId = req.user.userId; // Extracted from JWT token by your middleware

    try {
        const db = await connectToDatabase();
        const result = await db.collection('reviews').updateOne(
            { _id: new ObjectId(id), userId: new ObjectId(userId) }, // Match by ID and User ID
            { $set: { rating, reviewText, strength } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send('Review not found or not authorized to update.');
        }

        res.status(200).send('Review updated successfully.');
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).send('Server error.');
    }
};

exports.deleteReview = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId; // Extracted from JWT token by your middleware

    try {
        const db = await connectToDatabase();
        const result = await db.collection('reviews').deleteOne({ _id: new ObjectId(id), userId: new ObjectId(userId) });

        if (result.deletedCount === 0) {
            return res.status(404).send('Review not found or not authorized to delete.');
        }

        res.status(200).send('Review deleted successfully.');
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).send('Server error.');
    }
};


