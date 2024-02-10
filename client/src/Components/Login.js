import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiShow, BiHide } from "react-icons/bi";
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
    marginBottom: '200px',
    background: 'rgba(106, 13, 173, 0.2)', // Lighter, semi-transparent purple
    borderRadius: '20px', // Smoothly rounded corners for the form
    border: '1px solid white', // White border for contrast
    display: 'flex',
    flexDirection: 'column', // Stack form elements vertically
    alignItems: 'center', // Center align form elements
    justifyContent: 'center', // Center content vertically
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
  },
  input: {
    width: '90%', // Full width of the form container
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
    marginTop: '20px', // Space above the sign-up link
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
  icon: {
    marginBottom: '100px',
      position: 'absolute', // Position icons inside the input fields
    right: '10px', // Align to the right
    top: '50%', // Center vertically
    transform: 'translateY(-50%)', // Perfect vertical centering
    color: '#FFF', // White to match the input text color
    cursor: 'pointer', // Pointer to indicate clickable
  }
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Using axios for consistency with the RatingForm example
      const response = await axios.post('/login', {
        username,
        password,
      });

      if (response.status === 200) {
        // Store the token in localStorage or sessionStorage
        localStorage.setItem('token', response.data.token);

        // Authentication successful, redirect to the main content or user profile
        navigate('/home');
      } else {
        // Handle failed login attempt
        console.log('Authentication failed. Invalid username or password.');
      }
    } catch (error) {
      // Handle any errors
      console.error('An error occurred:', error);
      alert('Login failed: ' + (error.response?.data || 'Please try again later.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
    <form style={styles.form} onSubmit={handleLogin}>
        <h2>Login</h2>
        <div>
          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            style={{ ...styles.input, paddingRight: '30px' }}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              color: '#007BFF',
              cursor: 'pointer',
            }}
          >
            {showPassword ? <BiHide /> : <BiShow />}
          </div>
        </div>
        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p>
        Don't have an account? <Link to="/signup" style={styles.link}>Sign Up</Link>
      </p>
      </form>
      
    </div>
  );
};

export default Login;