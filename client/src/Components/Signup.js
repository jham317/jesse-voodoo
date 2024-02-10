import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh', // Full viewport height
    background: 'linear-gradient(to bottom, #6a0dad, #9b59b6)', // Purple gradient background
    fontFamily: 'Poppins, sans-serif',
  },
  form: {
    width: '320px', // Adjusted width for a compact look
    padding: '40px', // Increased padding for a rounded effect
    background: 'rgba(106, 13, 173, 0.2)', // Lighter, semi-transparent purple
    borderRadius: '20px', // Smoothly rounded corners for the form
    border: '2px solid white', // White border for contrast
    display: 'flex',
    flexDirection: 'column', // Stack form elements vertically
    alignItems: 'center', // Center align form elements
    justifyContent: 'center', // Center content vertically
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
  },
  input: {
    width: '100%', // Full width of the form container
    padding: '12px', // Comfortable padding for typing
    marginBottom: '15px', // Space between form elements
    border: '1px solid #fff', // White border to stand out on the background
    borderRadius: '5px', // Consistently rounded corners
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slightly transparent background
    color: '#fff', // White text for readability
    fontSize: '16px', // Slightly larger font for ease of reading
    outline: 'none', // Remove the default focus outline
  },
  button: {
    padding: '10px 20px', // Adequate padding for clickability
    width: 'auto', // Auto width based on content
    backgroundColor: 'var(--prince-yellow)', // Vibrant prince yellow for the button
    color: 'white', // White text for contrast
    border: 'none', // No border for a clean look
    borderRadius: '5px', // Rounded corners for the button
    cursor: 'pointer', // Pointer cursor on hover
    fontSize: '18px', // Bold font size for visibility
    fontWeight: 'bold', // Bold font weight for emphasis
    marginTop: '20px', // Margin top for spacing from the inputs
  },
  link: {
    marginTop: '20px', // Space above the sign-in link
    color: 'var(--prince-yellow)', // Consistent prince yellow for clickable links
    textDecoration: 'none', // No underline for a clean look
    fontSize: '16px', // Comfortable reading size
    fontWeight: 'bold', // Bold for emphasis
  },
  title: {
    fontSize: '24px', // Large, readable title size
    color: '#FFF', // White for high contrast
    fontWeight: 'bold', // Bold for prominence
    marginBottom: '30px', // Space below the title for separation
  },
};

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post('/register', {
        username,
        password, // Email is not used in your AuthHandler.js. Include it if your backend supports it.
      });

      if (response.status === 201) {
        alert('Signup successful!');
        navigate('/login'); // Redirect user to login page after successful signup
      } else {
        alert('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('Signup failed: ' + (error.response?.data || 'Please try again later.'));
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSignup}>
        <h2 style={styles.title}>Sign Up</h2>
        <input
          style={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button style={styles.button} type="submit">
          Sign Up
        </button>
        <p>
        Already have an account? <Link to="/login" style={styles.link}>Log In</Link>
      </p>
      </form>
  
    </div>
  );
};

export default Signup;
