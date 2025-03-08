import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { UserProvider } from "./UserContext"; // Import the UserProvider

import Header from "./sections/Header";
import Hero from "./sections/Hero";
import About from "./sections/About";
import OurProducts from "./sections/OurProducts";
import Working from "./sections/Working";
import Testimonials from "./sections/Testimonials";
import Footer from "./sections/Footer";
import ReadMore from "./sections/ReadMore";
import Products from "./sections/Products";
import Policy from "./sections/Policy";
import Profile from "./sections/Profile.jsx";
import Login from "./sections/Login";
import Signup from "./sections/Signup";
import ProductDetails from "./sections/ProductDetails.jsx";

const App = () => {
  return (
    <UserProvider> {/* Wrap the app with UserProvider */}
      <Router>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <About />
                <OurProducts />
                <Working />
                <Testimonials />
              </>
            }
          />
          <Route path="/read-more" element={<ReadMore />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:title" element={<ProductDetails />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
};

export default App;
