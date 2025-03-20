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

    const orderItems = cart.map((item) => ({
      productId: item.productId || item.id,
      stockQuantity: item.quantity,
    }));

    console.log("Cart Contents in Checkout:", cart);
    console.log("Order Items in Checkout:", orderItems);

    if (orderItems.some((item) => !item.productId || item.productId === 0)) {
      toast.error(
        "Invalid product IDs in cart. Please ensure all items have valid product IDs."
      );
      return;
    }

    try {
      const shippingAddress = `${formData.streetAddress}, ${formData.city}, ${formData.province}, ${formData.postalCode}`;
      console.log("Request Payload:", { orderItems, shippingAddress });

      // Call createOrder API
      const orderResponse = await createOrder(
        orderItems,
        shippingAddress,
        token
      );

      console.log("Order Response:", orderResponse);

      // Check if paymentUrl is present in the response
      if (orderResponse.data && orderResponse.data.paymentUrl) {
        // Redirect to the payment URL
        window.location.href = orderResponse.data.paymentUrl;
      } else {
        throw new Error("Payment URL is missing in the response.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error(error.message);
    }
  };
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-green-600 mb-6">Checkout</h1>
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
        {/* Shipping Information Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-6"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              Shipping Information
            </h2>
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

        {/* Cart Summary */}
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            Order Summary
          </h2>
          {cart.map((item, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{item.productName}</h3>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
              </div>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
            </div>
          ))}
          <div className="mt-6">
            <div className="flex justify-between items-center">
              <p className="text-xl text-gray-700">Total Price:</p>
              <p className="text-2xl font-bold text-green-600">
                $
                {cart
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
