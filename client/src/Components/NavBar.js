import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust this import path to where your AuthContext is located

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    width: '100%',
    background: 'var(--prince-purple)',
    color: 'white',
    borderRadius: '0 0 20px 20px',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkContainer: {
    display: 'flex',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    fontFamily: 'Sniglet, cursive',
    padding: '0.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    marginRight: '1rem',
    fontSize: '1.5rem',
  },
  username: {
    fontFamily: 'Sniglet, cursive',
    fontSize: '1.5rem',
    marginRight: '10px',
  },
};

const NavBar = () => {
  const { currentUser } = useAuth(); // Use the authentication context

  return (
    <div style={styles.container}>
      <div style={styles.linkContainer}>
        {currentUser && (
          <>
            <Link to="/user/reviews" style={styles.link}>
              Reviews
            </Link>
            <Link to="/liked-songs" style={styles.link}>Liked Songs</Link>
          </>
        )}
      </div>
      <div>
        {currentUser ? (
          <div style={styles.username}>{currentUser.username}</div> // Display username from currentUser
        ) : (
          <div>
            <Link to="/login" style={styles.link}>Login</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
