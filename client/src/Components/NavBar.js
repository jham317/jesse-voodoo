import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.linkContainer}>
        {isLoggedIn && (
          <>
            <Link to="/user/reviews" style={styles.link}>
              Reviews
            </Link>
            <Link to="/liked-songs" style={styles.link}>Liked Songs</Link> {/* Add this line */}
          </>
        )}
      </div>
      <div>
        {isLoggedIn && <div style={styles.username}>{username}</div>}
        {!isLoggedIn && (
          <div style={styles.loginButton}>
            <Link to="/login">Login</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
