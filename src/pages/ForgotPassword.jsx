import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import testimonialImg from '../api/assets/hero-image.jpg';

const testimonial = {
  quote: '"BearPlex helped us build systems to streamline our processes and solved problems with brilliant approach."',
  name: 'Arthur J. Nicol',
  title: 'CFO, Founder',
  company: 'The Medside',
};

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setMessage('Check your email for a reset code.');
      setTimeout(() => {
        navigate('/reset-password');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split-container">
      {/* Left: Testimonial/Image */}
      <div className="login-split-left">
        <img src={testimonialImg} alt="Testimonial" className="login-split-img" />
        <div className="login-split-overlay">
          <div className="login-split-quote">{testimonial.quote}</div>
          <div className="login-split-name">{testimonial.name}</div>
          <div className="login-split-title">{testimonial.title} <span className="login-split-company">{testimonial.company}</span></div>
        </div>
      </div>
      {/* Right: Forgot Password Form */}
      <div className="login-split-right">
        <div className="login-form-card">
          <h2 className="login-form-title">Forgot Password</h2>
          <p className="login-form-desc">Enter your email to receive a reset code.</p>
          <form onSubmit={handleSubmit} className="login-form-modern">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="login-signin-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
            {message && <div style={{ color: 'green', marginTop: 8 }}>{message}</div>}
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          </form>
          <div className="login-signup-link">
            Remembered your password? <span onClick={() => navigate('/login')}>Sign in</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 