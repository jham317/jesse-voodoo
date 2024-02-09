import React, { useState } from 'react';
import axios from 'axios';

function RatingForm({ albumId }) { // Accept albumId as a prop
  const [rating, setRating] = useState(5); // Default rating value
  const [reviewText, setReviewText] = useState(''); // State for review text
  const [strength, setStrength] = useState('mid'); // Possible values: 'light', 'mid', 'strong'

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage

    try {
        await axios.post('http://localhost:4000/reviews', {
            albumId,
            strength,
            rating: parseInt(rating, 10), // Convert rating to an integer
            reviewText

          }, {
            headers: {
              Authorization: `Bearer ${token}` // Include the token in the request headers for authentication
            }
          });
          
      alert('Review submitted successfully');
      // Optionally clear the form
      setRating(0);
      setReviewText('');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Make sure you are logged in.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Leave a Rating and Review</h3>
      <div>
  <label>Strength: </label>
  <select value={strength} onChange={(e) => setStrength(e.target.value)}>
    <option value="light">Light</option>
    <option value="mid">Mid</option>
    <option value="strong">Strong</option>
  </select>
</div>
      <div>
        <label>Rating (1-10): </label>
        <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} min="1" max="10" required />
      </div>
      <div>
        <label>Review: </label>
        <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} required />
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default RatingForm;
