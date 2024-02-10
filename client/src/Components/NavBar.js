import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from "react-icons/fa";

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: 'var(--prince-purple)',
    color: 'white',
    position: 'fixed',
    top: 0,
    width: '100%',
    borderRadius: '0 0 20px 20px',
  },

  link: {
    textDecoration: 'none',
    color: 'white',
    fontFamily: 'Sniglet, cursive',
    padding: '0.5rem 2rem',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    marginRight: '10px',
    fontSize: '1.5rem',
  },

  loginButtonContainer: {
    marginRight: 'auto',
  },
  loginButton: {
    textDecoration: 'none',
    backgroundColor: 'var(--prince-purple)',
    fontFamily: 'Sniglet, cursive',
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
      <Link to="/user/reviews" style={styles.link}>
        <FaStar /> Reviews
      </Link>
     
    </div>
  );
};

export default NavBar;
