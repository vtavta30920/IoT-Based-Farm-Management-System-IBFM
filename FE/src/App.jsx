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

import AccountDetail from "./pages/Admin/AccountDetail.jsx";
import CreateAccount from "./pages/Admin/CreateAccount.jsx";

import AdminLayout from "./sections/Layouts/AdminLayout.jsx";
import StaffLayout from "./sections/Layouts/StaffLayout.jsx";
import ManagerLayout from "./sections/Layouts/ManagerLayout.jsx";

import IotMonitoring from "./sections/Manager/IotMonitoring.jsx";
import FarmingSchedules from "./sections/Manager/FarmingSchedules.jsx";
import InventoryManagement from "./sections/Manager/InventoryManagement.jsx";
import Reports from "./sections/Manager/Reports.jsx";

// Staff Pages
import IotDevices from "./sections/Staff/IotDevices.jsx";
import DeviceDetails from "./sections/Staff/DeviceDetails.jsx";
import FarmingTasks from "./sections/Staff/FarmingTasks.jsx";
import TaskDetails from "./sections/Staff/TaskDetails.jsx";
import QualityControl from "./sections/Staff/QualityControl.jsx";
import Logistics from "./sections/Staff/Logistics.jsx";

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

                {/* Staff Routes */}
                <Route path="/staff/*" element={<StaffLayout />}>
                  <Route index element={<IotDevices />} />
                  <Route path="iot-devices" element={<IotDevices />} />
                  <Route path="iot-devices/:id" element={<DeviceDetails />} />
                  <Route path="farming-tasks" element={<FarmingTasks />} />
                  <Route path="farming-tasks/:id" element={<TaskDetails />} />
                  <Route path="quality-control" element={<QualityControl />} />
                  <Route path="logistics" element={<Logistics />} />
                </Route>

                {/* Manager Routes */}
                <Route path="/manager/*" element={<ManagerLayout />}>
                  <Route index element={<IotMonitoring />} />
                  <Route path="iot-monitoring" element={<IotMonitoring />} />
                  <Route
                    path="farming-schedules"
                    element={<FarmingSchedules />}
                  />
                  <Route path="inventory" element={<InventoryManagement />} />
                  <Route path="reports" element={<Reports />} />
                </Route>

                <Route path="/admin/users/detail" element={<AccountDetail />} />
                <Route path="/admin/users/create" element={<CreateAccount />} />

                {/* Route cho trang staff */}

                <Route path="/admin/*" element={<AdminLayout />} />
              </Routes>
              <Footer />
            </Router>
          </SidebarProvider>
        </CartProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
