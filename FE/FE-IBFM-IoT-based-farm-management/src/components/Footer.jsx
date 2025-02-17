import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>FarmIoT</h3>
          <p>Revolutionizing farming with IoT technology</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/news">News</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>123 Farm Road, Agriville, AG 12345</p>
          <p>Email: info@farmiot.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 FarmIoT. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
