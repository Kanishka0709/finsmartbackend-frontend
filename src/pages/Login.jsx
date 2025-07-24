import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { loginUser, getUsers } from '../api/userApi';
import testimonialImg from '../api/assets/hero-image.jpg'; // Use your hero image or any colorful image

const testimonial = {
  quote: '"BearPlex helped us build systems to streamline our processes and solved problems with brilliant approach."',
  name: 'Arthur J. Nicol',
  title: 'CFO, Founder',
  company: 'The Medside',
};

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await loginUser(username, password);
      // Only fetch user info after successful login
      const usersRes = await getUsers();
      const users = usersRes.data;
      const found = users.find(u => u.username === username);
      if (found) {
        localStorage.setItem('user', JSON.stringify(found));
        navigate('/dashboard');
      } else {
        setError('User not found after login.');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-split-container">
      {/* Left: Testimonial/Image */}
      <div className="login-split-left">
        <img src={testimonialImg} alt="Testimonial" className="login-split-img" />
        {/* Removed testimonial overlay content */}
      </div>
      {/* Right: Login Form */}
      <div className="login-split-right">
        <div className="login-form-card">
          <h2 className="login-form-title">Login</h2>
          <p className="login-form-desc">Log in to your account.</p>
          <form onSubmit={handleLogin} className="login-form-modern">
            <label>Username</label> {/* Changed from Email to Username for Spring Security compatibility */}
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required />
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />
            <div className="login-form-row">
              <label className="login-remember">
                <input type="checkbox" /> Remember me
              </label>
              <span className="login-forgot" onClick={() => navigate('/forgot-password')} style={{ cursor: 'pointer', color: '#007bff' }}>Forgot password?</span>
            </div>
            <button type="submit" className="login-signin-btn">Sign in</button>
            {error && <div className="error-message">{error}</div>}
          </form>
          <div className="login-signup-link">
            Don&apos;t have an account? <span onClick={() => navigate('/signup')}>Sign up</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
