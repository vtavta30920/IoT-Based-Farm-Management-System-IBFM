import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NewsPage from "./pages/NewsPage";
import ProductsPage from "./pages/ProductsPage";
import AboutUsPage from "./pages/AboutUsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles/HomePage.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
