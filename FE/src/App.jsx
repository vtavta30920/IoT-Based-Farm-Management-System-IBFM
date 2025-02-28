import React from "react";
import Header from "./sections/Header";
import Hero from "./sections/Hero";
import About from "./sections/About";
import OurProducts from "./sections/OurProducts";

import Working from "./sections/Working";
import Testimonials from "./sections/Testimonials";

import Footer from "./sections/Footer";

const App = () => {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <OurProducts />
      <Working />
      <Testimonials />
      <Footer />
    </>
  );
};

export default App;
