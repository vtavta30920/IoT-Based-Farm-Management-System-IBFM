import React from "react";

const NewsPage = () => {
  return (
    <div className="news-container">
      <h1>Latest News</h1>

      <article className="news-item">
        <h2>How IoT is Changing Farming</h2>
        <p>
          IoT devices are transforming the agriculture industry by optimizing
          resources...
        </p>
        <a href="#">Read More</a>
      </article>

      <article className="news-item">
        <h2>Best Smart Sensors for Agriculture</h2>
        <p>
          Discover the top IoT sensors that help farmers track soil moisture,
          temperature...
        </p>
        <a href="#">Read More</a>
      </article>
    </div>
  );
};

export default NewsPage;
