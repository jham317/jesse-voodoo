import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [editReviewId, setEditReviewId] = useState(null);
    const [editFormData, setEditFormData] = useState({ rating: '', reviewText: '', strength: 'mid' });
    const [selectedYear, setSelectedYear] = useState('All');
    const [years, setYears] = useState([]);

    useEffect(() => {
        fetchReviews();
    }, [selectedYear]); // Fetch reviews whenever selectedYear changes

    const fetchReviews = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("User not logged in");
            return;
        }

        try {
            const response = await axios.get('http://localhost:4000/user/reviews', {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Include fetching album details from your Spotify route here
            const reviewsWithDetails = await Promise.all(response.data.map(async (review) => {
                const albumDetailsResponse = await axios.get(`http://localhost:4000/albums/${review.albumId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return {
                    ...review,
                    albumDetails: albumDetailsResponse.data,
                };
            }));

            setReviews(reviewsWithDetails.sort((a, b) => {
                const strengthOrder = { light: 1, mid: 2, strong: 3 };
                if (b.rating - a.rating !== 0) return b.rating - a.rating;
                return strengthOrder[b.strength] - strengthOrder[a.strength];
            }));

            // Extract and set years from reviews
            const extractedYears = reviewsWithDetails.map(review => new Date(review.albumDetails.release_date).getFullYear());
            setYears([...new Set(extractedYears)].sort((a, b) => b - a));
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        }
    };

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        setEditFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    };

    const handleEditClick = (review) => {
        setEditReviewId(review._id);
        setEditFormData({
            rating: review.rating.toString(),
            reviewText: review.reviewText,
            strength: review.strength,
        });
    };

    const handleCancelClick = () => {
        setEditReviewId(null);
    };

    const handleSaveClick = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:4000/reviews/${editReviewId}`, editFormData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchReviews();
            setEditReviewId(null);
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    const handleDeleteClick = async (reviewId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this review?");
        if (!confirmDelete) return;

        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:4000/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    return (
        <div>
            <h2>My Reviews</h2>
            <div>
                <label>Filter by year: </label>
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    <option value="All">All Years</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {reviews.filter(review => selectedYear === 'All' || new Date(review.albumDetails.release_date).getFullYear().toString() === selectedYear).map((review) => (
                    <div key={review._id} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
                        {editReviewId === review._id ? (
                            <form onSubmit={handleSaveClick}>
                                <div>
                                    <label>Rating: </label>
                                    <input type="number" name="rating" value={editFormData.rating} onChange={handleEditFormChange} />
                                </div>
                                <div>
                                    <label>Strength: </label>
                                    <select name="strength" value={editFormData.strength} onChange={handleEditFormChange}>
                                        <option value="light">Light</option>
                                        <option value="mid">Mid</option>
                                        <option value="strong">Strong</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Review Text: </label>
                                    <textarea name="reviewText" value={editFormData.reviewText} onChange={handleEditFormChange} />
                                </div>
                                <button type="submit">Save</button>
                                <button onClick={handleCancelClick}>Cancel</button>
                            </form>
                        ) : (
                            <>
                                {review.albumDetails.images[0] && (
                                    <img src={review.albumDetails.images[0].url} alt="Album cover" style={{ width: '100px', height: '100px', marginBottom: '10px' }} />
                                )}
                                <h3>{review.albumDetails.name} by {review.albumDetails.artists.map(artist => artist.name).join(', ')}</h3>
                                <p>Rating: {review.rating} ({review.strength})</p>
                                <p>Review: {review.reviewText}</p>
                                <button onClick={() => handleEditClick(review)}>Edit</button>
                                <button onClick={() => handleDeleteClick(review._id)}>Delete</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserReviewsPage;
