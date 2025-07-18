// pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <h1>Pet-Vet Platform</h1>
        <div className="nav-links">
          
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login" className="cta-button login-btn">Login</Link>
          <Link to="/register" className="cta-button register-btn">Register</Link>
        </div>
      </nav>

      <div className="hero">
        <img 
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
          alt="Pets with veterinarian" 
          className="hero-image"
        />
        <div className="hero-text">
          <h2>Your Trusted Partner for Pet Healthcare</h2>
          <p>Connect with veterinarians, manage appointments, and access quality pet care services all in one place.</p>
          <div className="hero-buttons">
            <Link to="/login" className="cta-button">Explore Services</Link>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-container">
          <div className="feature-card">
            <h3>For Pet Owners</h3>
            <p>Book appointments, access emergency consultations, and manage your pet's health records all from one convenient platform.</p>
          </div>
          <div className="feature-card">
            <h3>For Veterinarians</h3>
            <p>Manage appointments, access patient records, and provide quality care efficiently with our comprehensive veterinary tools.</p>
          </div>
          <div className="feature-card">
            <h3>For Suppliers</h3>
            <p>Manage inventory, track orders, and supply quality medicines to veterinary clinics through our streamlined supply chain system.</p>
          </div>
        </div>

        <div className="quick-links">
          <Link to="/about" className="quick-link">
            <span>Learn more about our platform</span>
            <span className="arrow">→</span>
          </Link>
          <Link to="/contact" className="quick-link">
            <span>Get in touch with our team</span>
            <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
