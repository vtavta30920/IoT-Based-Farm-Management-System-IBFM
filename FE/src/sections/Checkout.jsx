import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../CartContext";
import { UserContext } from "../UserContext";
import { createOrder, createVNPayPaymentUrl } from "../api/api";
import { toast } from "react-toastify";

const Checkout = () => {
  const { cart } = useContext(CartContext);
  const { user, token } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    streetAddress: "",
    apartment: "",
    postalCode: "",
    city: "",
    province: "",
    phoneNumber: "",
    useAsBillingAddress: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.streetAddress ||
      !formData.postalCode ||
      !formData.city ||
      !formData.province ||
      !formData.phoneNumber
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }

    if (!user || !token) {
      toast.error("You must be logged in to proceed to checkout.");
      return;
    }

    try {
      // Prepare shipping address
      const shippingAddress = `${formData.streetAddress}, ${formData.city}, ${formData.province}, ${formData.postalCode}`;

      // Prepare order items
      const orderItems = cart.map((item) => ({
        productId: item.productId, // Assuming productId is available in the cart item
        stockQuantity: item.quantity,
      }));

      // Create the order
      const orderResponse = await createOrder(
        orderItems,
        shippingAddress,
        token
      );
      const orderId = orderResponse.orderId;

      // Prepare payment data
      const paymentData = {
        orderId,
        orderType: "billpayment",
        amount: cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ), // Total amount
        orderDescription: "Payment for order",
        name: `${formData.firstName} ${formData.lastName}`,
      };

      // Create VNPay payment URL
      const paymentResponse = await createVNPayPaymentUrl(
        paymentData.orderId,
        paymentData.orderType,
        paymentData.amount,
        paymentData.orderDescription,
        paymentData.name,
        token
      );

      // Redirect to VNPay payment page
      window.location.href = paymentResponse.paymentUrl;
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-green-600 mb-6">Checkout</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Street Address *</label>
            <input
              type="text"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">
              Apartment, Suite, or Other
            </label>
            <input
              type="text"
              name="apartment"
              value={formData.apartment}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-700">Postal Code *</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Province *</label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Please Select</option>
              <option value="Province 1">Province 1</option>
              <option value="Province 2">Province 2</option>
              {/* Add more provinces as needed */}
            </select>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Phone Number *</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="useAsBillingAddress"
                checked={formData.useAsBillingAddress}
                onChange={handleChange}
                className="mr-2"
              />
              Use as billing address
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300"
        >
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default Checkout;
