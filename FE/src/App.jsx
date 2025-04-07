import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext";
import { CartProvider } from "./CartContext";
import { SidebarProvider } from "./SidebarToggle.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import Cart from "./sections/Cart.jsx";
import Checkout from "./sections/Checkout.jsx";
import OrderSuccess from "./sections/OrderSuccess.jsx";
import OrderFailed from "./sections/OrderFailed.jsx";
import VnPayCallback from "./sections/VnPayCallback.jsx";

import AdminLayout from "./sections/Layouts/AdminLayout.jsx";
import StaffLayout from "./sections/Layouts/StaffLayout.jsx";
import ManagerLayout from "./sections/Layouts/ManagerLayout.jsx";

import FarmingSchedules from "./sections/Manager/FarmingSchedules.jsx";

const App = () => {
  return (
    <>
      <ToastContainer />
      <UserProvider>
        <CartProvider>
          <SidebarProvider>
            {" "}
            {/* Wrap with SidebarProvider */}
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
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/order-failed" element={<OrderFailed />} />
                <Route path="/vnpay-callback" element={<VnPayCallback />} />

                {/* Route cho trang staff */}
                <Route path="/admin/*" element={<AdminLayout />} />
                {/* <Route path="/users" element={<ManageUsers />} />
        <Route path="/settings" element={<SystemSettings />} />
        <Route path="/performance" element={<SystemPerformance />} /> */}
                {/* Thêm các route con khác của admin */}
                <Route path="/staff/*" element={<StaffLayout />} />

                {/* <Route path="/iot-devices" element={<IotDevices />} />
        <Route path="/farming-tasks" element={<FarmingTasks />} />
        <Route path="/quality-control" element={<QualityControl />} />
        <Route path="/logistics" element={<Logistics />} /> */}
                {/* Thêm các route con khác của staff */}
                <Route path="/manager/*" element={<ManagerLayout />} />
                <Route
                  path="/manager/farming-schedules"
                  element={<FarmingSchedules />}
                />
                {/* <Route path="/iot-monitoring" element={<IotMonitoring />} />
       
        <Route path="/inventory" element={<InventoryManagement />} />
        <Route path="/reports" element={<Reports />} /> */}
                {/* Thêm các route con khác của manager */}
              </Routes>

              <Footer />
            </Router>
          </SidebarProvider>
        </CartProvider>
      </UserProvider>
    </>
  );
};

export default App;
