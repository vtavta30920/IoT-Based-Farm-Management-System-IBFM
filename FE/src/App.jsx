import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { UserProvider } from "./contexts/UserContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { SidebarProvider } from "./contexts/SidebarToggle.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Header from "./components/Header.jsx";
import Hero from "./pages/public/Home/Hero.jsx";
import About from "./pages/public/Home/About.jsx";
import OurProducts from "./pages/public/Home/OurProducts.jsx";
import Working from "./pages/public/Home/Working.jsx";
import Testimonials from "./pages/public/Home/Testimonials.jsx";
import ReadMore from "./pages/public/ReadMore.jsx";
import Products from "./pages/public/Products/Products.jsx";
import ProductDetails from "./pages/public/Products/ProductDetails.jsx";
import Policy from "./pages/public/Policy.jsx";
import Login from "./pages/public/Auth/Login.jsx";
import Unauthorized from "./components/common/Unauthorized.jsx";
import Signup from "./pages/public/Auth/Signup.jsx";
import OrderSuccess from "./pages/customer/Orders/OrderSuccess.jsx";
import OrderFailed from "./pages/customer/Orders/OrderFailed.jsx";
import VnPayCallback from "./pages/customer/Payment/VnPayCallback.jsx";
import Profile from "./pages/customer/Profile.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import Cart from "./pages/customer/Cart.jsx";
import Checkout from "./pages/customer/Checkout.jsx";
import CurrentUserOrderList from "./pages/customer/Orders/CurrentUserOrderList.jsx";
import Footer from "./components/Footer.jsx";

import StaffLayout from "./components/layouts/StaffLayout.jsx";

import QualityControl from "./pages/staff/QualityControl.jsx";
import Logistics from "./pages/staff/Logistics.jsx";
import ProductsManagement from "./pages/staff/ProductsManagement.jsx";
import OrderManagementStaff from "./pages/staff/OrderManagementStaff.jsx";
import FarmingTasks from "./pages/staff/FarmingTasks.jsx";
import TaskDetails from "./pages/staff/TaskDetails.jsx";

import ManagerLayout from "./components/layouts/ManagerLayout.jsx";
import FarmingSchedules from "./pages/manager/FarmingSchedules.jsx";
import IotMonitoring from "./pages/manager/IotMonitoring.jsx";
import InventoryManagement from "./pages/manager/InventoryManagement.jsx";
import Report from "./pages/manager/Reports.jsx";
import FarmManagement from "./pages/manager/FarmManagement.jsx";
import CropManagement from "./pages/manager/CropManagement.jsx";
import OrdersManagement from "./pages/manager/OrdersManagement.jsx";
import CategoryManagement from "./pages/manager/CategoryManagement.jsx";
import IotDevices from "./pages/manager/IotDevices.jsx";
import DeviceDetails from "./pages/manager/DeviceDetails.jsx";

import AdminLayout from "./components/layouts/AdminLayout.jsx";
import AccountDetail from "./pages/admin/AccountDetail";
import CreateAccount from "@/pages/admin/CreateAccount";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />
      <UserProvider>
        <CartProvider>
          <SidebarProvider>
            <Router>
              <Header />
              <ToastContainer />
              <Routes>
                {/* Public Routes */}
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
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/order-failed" element={<OrderFailed />} />
                <Route path="/vnpay-callback" element={<VnPayCallback />} />
                <Route path="/profile" element={<Profile />} />

                {/* Customer Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={["Customer"]} />}>
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/myOrders" element={<CurrentUserOrderList />} />
                </Route>

                {/* Staff Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={["Staff"]} />}>
                  <Route path="/staff/*" element={<StaffLayout />}>
                    <Route index element={<ProductsManagement />} />

                    <Route path="farming-tasks" element={<FarmingTasks />} />
                    <Route path="farming-tasks/:id" element={<TaskDetails />} />
                    <Route
                      path="quality-control"
                      element={<QualityControl />}
                    />
                    <Route path="logistics" element={<Logistics />} />
                    <Route
                      path="ProductsManagement"
                      element={<ProductsManagement />}
                    />
                    <Route
                      path="OrderManagementStaff"
                      element={<OrderManagementStaff />}
                    />
                  </Route>
                </Route>

                {/* Manager Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={["Manager"]} />}>
                  <Route path="/manager/*" element={<ManagerLayout />}>
                    <Route index element={<FarmingSchedules />} />
                    <Route
                      path="farming-schedules"
                      element={<FarmingSchedules />}
                    />
                    <Route path="iot-monitoring" element={<IotMonitoring />} />
                    <Route path="inventory" element={<InventoryManagement />} />
                    <Route path="reports" element={<Report />} />
                    <Route path="farms" element={<FarmManagement />} />
                    <Route path="crops" element={<CropManagement />} />
                    <Route
                      path="OrderManagement"
                      element={<OrdersManagement />}
                    />
                    <Route
                      path="CategoryManagement"
                      element={<CategoryManagement />}
                    />
                    <Route path="iot-devices" element={<IotDevices />} />
                    <Route path="iot-devices/:id" element={<DeviceDetails />} />
                  </Route>
                </Route>

                {/* Admin Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                  <Route path="/admin/*" element={<AdminLayout />} />
                  <Route
                    path="/admin/users/detail"
                    element={<AccountDetail />}
                  />
                  <Route
                    path="/admin/users/create"
                    element={<CreateAccount />}
                  />
                </Route>

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
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
