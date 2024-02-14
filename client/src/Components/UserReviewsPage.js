import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom'; // Import useNavigate

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
        marginBottom: '20px', // Adjusted margin
    },
    filterContainer: {
        display: 'flex',
        justifyContent: 'center',
        margin: '20px 0',
        marginBottom: '20px', // Adjusted margin
        alignItems: 'center',
        paddingLeft: '10px', // Added left padding
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
        marginRight: '10px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
    },
    reviewCard: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#673ab7',
        padding: '10px', // Reduce padding to make the container smaller vertically
        borderRadius: '10px',
        boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '10px',
    },
    reviewTextContainer: {
        flex: '1',
        overflow: 'hidden',
        paddingBottom: '10px', // Adjusted padding
    },
    reviewText: {
        color: '#fff',
        margin: '0px 0',
        marginBottom: '10px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 'auto', // Push the button container to the bottom
        paddingTop: '5px', // Adjusted padding
    },
    button: {
        padding: '8px 12px',
        backgroundColor: 'var(--prince-yellow)',
        border: 'none',
        borderRadius: '20px',
        color: '#673ab7',
        cursor: 'pointer',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: '0.8rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transition: 'background-color 0.3s ease',
        margin: '5px',
    },
};

function UserReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [editReviewId, setEditReviewId] = useState(null);
    const [editFormData, setEditFormData] = useState({ rating: '', reviewText: '', strength: 'mid' });
    const [selectedYear, setSelectedYear] = useState('All');
    const [years, setYears] = useState([]);
    const [sortBy, setSortBy] = useState('rating'); // Added sortBy state
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track authentication status
    const navigate = useNavigate(); // Get the navigate function
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login'); // Redirect to login page if token is not present
        } else {
          setIsLoggedIn(true); // Set isLoggedIn to true if token exists
        }
      }, [navigate]); // Include navigate in the dependency array to prevent useEffect from running indefinitely
    
      useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists, false otherwise
      }, []); // Empty dependency array ensures this effect only runs once on component mount
    

      const fetchReviews = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("User not logged in");
            return;
        }
        try {
            const response = await axios.get('http://localhost:4000/user/reviews', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const reviewsWithDetails = await Promise.all(response.data.map(async (review) => {
                const albumDetailsResponse = await axios.get(`http://localhost:4000/albums/${review.albumId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return {
                    ...review,
                    albumDetails: albumDetailsResponse.data,
                };
            }));
    
            // Sort reviews
            const sortedReviews = reviewsWithDetails.sort((a, b) => {
                if (sortBy === 'rating') {
                    // Assign weights to strength levels
                    const weight = { light: 0, mid: 1, strong: 2 };
                    const rankA = a.rating * 10 + weight[a.strength];
                    const rankB = b.rating * 10 + weight[b.strength];
                    return rankB - rankA;
                } else if (sortBy === 'date') {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                return 0;
            });
    
            // Set reviews with adjusted rankings
            setReviews(sortedReviews);
    
            // Reset rankings for the selected year
            const filteredReviews = sortedReviews.filter(review => selectedYear === 'All' || new Date(review.albumDetails.release_date).getFullYear().toString() === selectedYear);
            const resetRankedReviews = filteredReviews.map((review, index) => ({ ...review, rank: index + 1 }));
            setReviews(resetRankedReviews);
    
            // Extract years for filter options
            const extractedYears = reviewsWithDetails.map(review => new Date(review.albumDetails.release_date).getFullYear());
            setYears([...new Set(extractedYears)].sort((a, b) => b - a));
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        }
    }, [selectedYear, sortBy]);

    useEffect(() => {
        fetchReviews();
    }, [selectedYear, sortBy, fetchReviews]);
    
    const handleSortChange = (event) => {
        setSortBy(event.target.value);
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
            fetchReviews(); // This line fetches the updated reviews
            setEditReviewId(null); // Reset editReviewId after saving
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

    const handleSeeMoreClick = (reviewId) => {
        const updatedReviews = reviews.map(review => {
            if (review._id === reviewId) {
                return { ...review, showMore: true };
            }
            return review;
        });
        setReviews(updatedReviews);
    };

    const handleSeeLessClick = (reviewId) => {
        const updatedReviews = reviews.map(review => {
            if (review._id === reviewId) {
                return { ...review, showMore: false };
            }
            return review;
        });
        setReviews(updatedReviews);
    };
    return (
        <div style={styles.container}>
          {/* Render login button if not logged in */}
          {!isLoggedIn && (
            <button onClick={() => navigate('/login')} style={styles.button}>
              Login
            </button>
          )}
      
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
      
          <div style={styles.filterContainer}>
            <label style={styles.formLabel}>Sort by: </label>
            <select style={styles.select} value={sortBy} onChange={handleSortChange}>
              <option value="rating">Highest Rating</option>
              <option value="date">Date Reviewed</option>
            </select>
          </div>
      
          <div style={styles.grid}>
            {reviews.map((review) => (
              <div key={review._id} style={styles.reviewCard}>
                <span style={styles.rank}>Rank: {review.rank}</span>
                <div style={styles.reviewTextContainer}>
                  {/* Link the album image to the AlbumPage */}
                  <Link to={`/album/${review.albumDetails.id}`}>
                    {review.albumDetails.images[0] && (
                      <img src={review.albumDetails.images[0].url} alt="Album cover" style={{ width: '100%', borderRadius: '5px', marginBottom: '10px' }} />
                    )}
                  </Link>
                  <p style={styles.reviewText}>Date Reviewed: {new Date(review.createdAt).toLocaleDateString()}</p>
                  <h3 style={styles.reviewText}>{review.albumDetails.name} by {review.albumDetails.artists.map(artist => artist.name).join(', ')}</h3>
                  <p style={styles.reviewText}>Rating: {review.rating} - {review.strength}</p>
                  <p style={styles.reviewText}>
                    {review.showMore ? review.reviewText : `${review.reviewText.substring(0, 100)}`}
                    {review.reviewText.length > 100 && (
                      <button onClick={() => review.showMore ? handleSeeLessClick(review._id) : handleSeeMoreClick(review._id)} style={styles.button}>
                        {review.showMore ? 'See Less' : 'See More'}
                      </button>
                    )}
                  </p>
                  {editReviewId === review._id && (
                    <form onSubmit={handleSaveClick}>
                      <input
                        type="text"
                        name="rating"
                        value={editFormData.rating}
                        onChange={handleEditFormChange}
                        style={styles.formInput}
                      />
                      <textarea
                        name="reviewText"
                        value={editFormData.reviewText}
                        onChange={handleEditFormChange}
                        style={styles.textArea}
                      />
                      <select
                        name="strength"
                        value={editFormData.strength}
                        onChange={handleEditFormChange}
                        style={styles.formInput}
                      >
                        <option value="light">Light</option>
                        <option value="mid">Mid</option>
                        <option value="strong">Strong</option>
                      </select>
                      <button type="submit">Save</button>
                      <button type="button" onClick={handleCancelClick}>Cancel</button>
                    </form>
                  )}
                </div>
                <div style={styles.buttonContainer}>
                  <button onClick={() => handleEditClick(review)} style={styles.button}>Edit</button>
                  <button onClick={() => handleDeleteClick(review._id)} style={styles.button}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
}

export default UserReviewsPage;