import React from "react";
import "../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">🌾 IoT Farm</div>
      <nav>
        <a href="#news">News</a>
        <a href="#products">Products</a>
        <a href="#about">About Us</a>
      </nav>
      <div className="auth-buttons">
        <button className="auth-button">Log In</button>
        <button className="auth-button">Sign Up</button>
      </div>
    </header>
  );
};

export default Header;
