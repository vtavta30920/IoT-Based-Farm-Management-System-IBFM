import React from "react";
import "../styles/Header.css";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <header className="header">
      <div className="logo">🌾 IoT Farm</div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/news">News</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
          <li>
            <Link to="/privacy">Privacy Policy</Link>
          </li>
        </ul>
      </nav>
      <div className="auth-buttons">
        <button className="auth-button">Log In</button>
        <button className="auth-button">Sign Up</button>
      </div>
    </header>
  );
};

export default Header;
