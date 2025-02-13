import React from "react";
import "../styles/HomePage.css";

const HomePage = () => {
  return (
    <div className="home-container">
      <section className="news-section">
        <h2>Latest News</h2>
        <p>Stay updated with the latest trends in IoT farming.</p>
      </section>

      <section className="products-section">
        <h2>Agricultural Products</h2>
        <p>Explore our fresh, IoT-managed farm products.</p>
      </section>
    </div>
  );
};

export default HomePage;
