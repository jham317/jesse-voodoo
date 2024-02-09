import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from "react-icons/fa";

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: 'var(--prince-purple)', // Background color for the navigation bar
    color: 'white',
    position: 'fixed', // Fix the navigation bar at the top
    top: 0, // Position it at the top of the viewport
    width: '100%', // Make it full width
    borderRadius: '0 0 20px 20px', // Rounded bottom corners
  },

  link: {
    textDecoration: 'none',
    color: 'white',
    fontFamily: 'Sniglet, cursive',
    padding: '0.5rem 2rem',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    marginRight: '10px', // Add some space between the icons if needed
    fontSize: '1.5rem', // Adjust based on your design
  },

  loginButtonContainer: {
    marginRight: 'auto', // Move the login button to the right
  },
  loginButton: {
    textDecoration: 'none',
    backgroundColor: 'var(--prince-purple)',
    fontFamily: 'Sniglet, cursive', // Use custom font
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '20px',
    fontSize: '1.8rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

const NavBar = () => {
  return (
    <div style={styles.container}>
      <div style={styles.loginButtonContainer}>
        <Link to="/login" style={styles.loginButton} className="login-button">
          Login
        </Link>
      </div>
      {/* User Reviews Page Link */}
      <Link to="/user/reviews" style={styles.link}>
        <FaStar /> Reviews
      </Link>
    </div>
  );
};

export default NavBar;
