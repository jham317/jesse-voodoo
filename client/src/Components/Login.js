import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiShow, BiHide } from "react-icons/bi";
import axios from 'axios'; //

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    fontFamily: 'Poppins, sans-serif', // Use Poppins as the primary font

  },
  form: {
    width: '300px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
    fontFamily: 'Poppins, sans-serif', // Use Poppins as the primary font

  },
  input: {
    marginBottom: '10px',
    padding: '8px',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '10px',
    width: '100%',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif', // Use Poppins as the primary font

  },
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
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;