import React from "react";

const AboutUsPage = () => {
  return (
    <div className="about-container">
      <h1>About FarmIoT</h1>
      <p>
        We are dedicated to revolutionizing agriculture with IoT technology.
      </p>

      <section className="mission">
        <h2>Our Mission</h2>
        <p>
          To empower farmers with smart, data-driven solutions for efficient
          agriculture.
        </p>
      </section>

      <section className="team">
        <h2>Meet Our Team</h2>
        <div className="team-member">👨‍💻 Alex - CEO</div>
        <div className="team-member">👩‍🔬 Sarah - Lead Engineer</div>
        <div className="team-member">👨‍🌾 John - Agriculture Specialist</div>
      </section>
    </div>
  );
};

export default AboutUsPage;
