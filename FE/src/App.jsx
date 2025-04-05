import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { SidebarProvider } from "./SidebarToggle.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./sections/Header";
import Hero from "./sections/Hero";
import About from "./pages/About";
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
import ManageUsers from "./pages/Admin/ManageUsers.jsx";

import AdminLayout from "./sections/Layouts/AdminLayout.jsx";
import StaffLayout from "./sections/Layouts/StaffLayout.jsx";
import ManagerLayout from "./sections/Layouts/ManagerLayout.jsx";

import FarmingSchedules from "./sections/Manager/FarmingSchedules.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />
      <UserProvider>
        <CartProvider>
          <SidebarProvider>
            {" "}
            {/* Wrap with SidebarProvider */}
            <Router>
              <Header />
              <ToastContainer />
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

                <Route
                  path="/manager/farming-schedules"
                  element={<FarmingSchedules />}
                />

                <Route path="/admin/users" element={<ManageUsers />} />
                {/* Route cho trang staff */}

                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="/staff/*" element={<StaffRoutes />} />
                <Route path="/manager/*" element={<ManagerRoutes />} />
              </Routes>
              <Footer />
            </Router>
          </SidebarProvider>
        </CartProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminLayout />} />
        {/* <Route path="/users" element={<ManageUsers />} /> */}
        {/*<Route path="/settings" element={<SystemSettings />} />
        <Route path="/performance" element={<SystemPerformance />} /> */}
        {/* Thêm các route con khác của admin */}
      </Routes>
    </AdminLayout>
  );
}

function StaffRoutes() {
  return (
    <StaffLayout>
      <Routes>
        <Route path="/" element={<StaffLayout />} />
        {/* <Route path="/iot-devices" element={<IotDevices />} />
        <Route path="/farming-tasks" element={<FarmingTasks />} />
        <Route path="/quality-control" element={<QualityControl />} />
        <Route path="/logistics" element={<Logistics />} /> */}
        {/* Thêm các route con khác của staff */}
      </Routes>
    </StaffLayout>
  );
}

function ManagerRoutes() {
  return (
    <ManagerLayout>
      <Routes>
        <Route path="/" element={<ManagerLayout />} />

        {/* <Route path="/iot-monitoring" element={<IotMonitoring />} />
       
        <Route path="/inventory" element={<InventoryManagement />} />
        <Route path="/reports" element={<Reports />} /> */}
        {/* Thêm các route con khác của manager */}
      </Routes>
    </ManagerLayout>
  );
}

export default App;
