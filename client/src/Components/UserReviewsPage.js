import React, { useState, useEffect } from 'react';
import axios from 'axios';
const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Poppins, sans-serif',
        color: '#fff',
        background: 'linear-gradient(to bottom, #6a0dad, #9b59b6)',
        minHeight: '100vh',
    },
    heading: {
        textAlign: 'center',
        fontSize: '2rem',
        color: '#fff',
    },
    filterContainer: {
        display: 'flex',
        justifyContent: 'center',
        margin: '20px 0',
    },
    select: {
        padding: '10px 20px',
        border: '2px solid #fff',
        borderRadius: '5px',
        backgroundColor: 'transparent',
        color: '#fff',
        outline: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 250px))', // Adjusted for more square cards
        gap: '20px',
    },
    reviewCard: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Ensures buttons are aligned to the bottom
        backgroundColor: '#673ab7',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
        height: '100%', // Ensures cards are of equal height
    },
    reviewText: {
        color: '#fff',
        margin: '0px 0',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between', // Spaces buttons evenly
        marginTop: '4px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '5px',
        color: 'white',
        cursor: 'pointer',
    },
    formInput: {
        width: '100%',
        padding: '8px',
        margin: '5px 0',
        borderRadius: '5px',
        border: '1px solid #fff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#fff',
    },
    textArea: {
        width: '100%',
        height: '100px',
        padding: '8px',
        margin: '5px 0',
        borderRadius: '5px',
        border: '1px solid #fff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#fff',
        resize: 'vertical',
    },
    formLabel: {
        display: 'block',
        margin: '10px 0 5px',
        color: '#fff',
    },
};

function UserReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [editReviewId, setEditReviewId] = useState(null);
    const [editFormData, setEditFormData] = useState({ rating: '', reviewText: '', strength: 'mid' });
    const [selectedYear, setSelectedYear] = useState('All');
    const [years, setYears] = useState([]);

    useEffect(() => {
        fetchReviews();
    }, [selectedYear]);

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
        <div style={styles.container}>
            <h2 style={styles.heading}>My Reviews</h2>
            <div style={styles.filterContainer}>
                <label style={styles.formLabel}>Filter by year: </label>
                <select style={styles.select} value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    <option value="All">All Years</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
            <div style={styles.grid}>
                {reviews.filter(review => selectedYear === 'All' || new Date(review.albumDetails.release_date).getFullYear().toString() === selectedYear).map((review) => (
                    <div key={review._id} style={styles.reviewCard}>
                        {editReviewId === review._id ? (
                            <form onSubmit={handleSaveClick}>
                                <label style={styles.formLabel}>Rating:</label>
                                <input type="number" name="rating" value={editFormData.rating} onChange={handleEditFormChange} style={styles.formInput} />
                                <label style={styles.formLabel}>Strength:</label>
                                <select name="strength" value={editFormData.strength} onChange={handleEditFormChange} style={styles.select}>
                                    <option value="light">Light</option>
                                    <option value="mid">Mid</option>
                                    <option value="strong">Strong</option>
                                </select>
                                <label style={styles.formLabel}>Review Text:</label>
                                <textarea name="reviewText" value={editFormData.reviewText} onChange={handleEditFormChange} style={styles.textArea} />
                                <button type="submit" style={styles.button}>Save</button>
                                <button type="button" onClick={handleCancelClick} style={styles.button}>Cancel</button>
                            </form>
                        ) : (
                            <>
                                {review.albumDetails.images[0] && (
                                    <img src={review.albumDetails.images[0].url} alt="Album cover" style={{ width: '100%', borderRadius: '5px', marginBottom: '10px' }} />
                                )}
                                <h3 style={styles.reviewText}>{review.albumDetails.name} by {review.albumDetails.artists.map(artist => artist.name).join(', ')}</h3>
                                <p style={styles.reviewText}>Rating: {review.rating} - {review.strength}</p>
                                <p style={styles.reviewText}>{review.reviewText}</p>
                                <button onClick={() => handleEditClick(review)} style={styles.button}>Edit</button>
                                <button onClick={() => handleDeleteClick(review._id)} style={styles.button}>Delete</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserReviewsPage;
