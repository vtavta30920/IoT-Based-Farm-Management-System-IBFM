import React from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Welcome to FarmIoT</h1>
        <p>Revolutionizing agriculture with smart IoT solutions.</p>
        <Link to="/products" className="cta-button">
          Explore Products
        </Link>
      </section>

      <section className="features">
        <h2>Why Choose FarmIoT?</h2>
        <div className="feature-grid">
          <div className="feature-card">🌱 Smart Irrigation</div>
          <div className="feature-card">📡 Real-time Monitoring</div>
          <div className="feature-card">📊 Data-driven Farming</div>
        </div>
      </section>

      <section className="latest-news">
        <h2>Latest News</h2>
        <p>Discover the latest advancements in smart farming.</p>
        <Link to="/news">Read More</Link>
      </section>

      <section className="cta">
        <h2>Join Us Today</h2>
        <Link to="/signup" className="cta-button">
          Sign Up
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
