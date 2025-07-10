import React, { useState } from 'react';
import '../styles/Home.css';
import heroImage from '../api/assets/hero-image.webp';
import logo from '../api/assets/logo.png';
import stockVideo from '../api/assets/stock-bg.mp4';

const slides = [
  {
    subheading: 'WE ARE HERE',
    headline: 'TO MANAGE\nYOUR FINANCES',
    text: 'Your all-in-one personal finance companion. Take control of your money, investments, and taxes with ease.',
    image: heroImage,
  },
  {
    subheading: 'SMART SOLUTIONS',
    headline: 'TRACK, PLAN\nAND GROW',
    text: 'Monitor expenses, plan investments, and simplify your tax journey with Finsmart Finances.',
    image: logo, // You can replace with another image if available
  },
];

export default function Home() {
  const [current] = useState(0);

  return (
    <div className="home-container">
      {/* Hero Section (fills viewport) with video background */}
      <div className="hero-full-bg" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        {/* Video background */}
        <video className="hero-bg-video" src={stockVideo} autoPlay loop muted playsInline />
        {/* Blue overlay for readability */}
        <div className="hero-bg-overlay" />
        {/* Content above video */}
        <div className="hero-content-row d-flex align-items-center justify-content-between px-4 py-5" style={{ width: '100%', position: 'relative', zIndex: 2 }}>
          {/* Left: Text Content */}
          <div className="hero-content-left text-start">
            <div className="hero-subheading mb-2">{slides[current].subheading}</div>
            <h1 className="hero-main-heading mb-3">{slides[current].headline.split('\\n').map((line, i) => <span key={i}>{line}<br/></span>)}</h1>
            <p className="hero-support-text mb-4">{slides[current].text}</p>
            <button className="btn hero-cta-btn swipe-btn" onClick={() => window.location.href = '/login'}>
              Start Journey
            </button>
          </div>
          {/* Right: Circular Hero Image */}
          <div className="hero-content-right d-flex align-items-center justify-content-center">
            <img src={slides[current].image} alt="Finance Hero" className="hero-image-circle" />
          </div>
        </div>
      </div>
    </div>
  );
}
