import React from "react";

const ProductsPage = () => {
  return (
    <div className="products-container">
      <h1>Our IoT-Enabled Products</h1>

      <div className="product-grid">
        <div className="product-card">
          <h2>Smart Soil Sensor</h2>
          <p>Monitor soil moisture and nutrients in real time.</p>
          <button>View Details</button>
        </div>

        <div className="product-card">
          <h2>Automated Irrigation System</h2>
          <p>Save water with AI-powered irrigation control.</p>
          <button>View Details</button>
        </div>

        <div className="product-card">
          <h2>Farm Monitoring Drone</h2>
          <p>Get a bird's-eye view of your farm with real-time data.</p>
          <button>View Details</button>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
