import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../CartContext";
import { UserContext } from "../UserContext";
import { createOrder } from "../api/api";
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

 // Add loading state at the top of the component
const [isProcessing, setIsProcessing] = useState(false);

// Update handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsProcessing(true);

  try {
    // Validation
    if (!user || !token) {
      toast.error("You must be logged in to proceed to checkout.");
      setIsProcessing(false);
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty. Please add items before checkout.");
      setIsProcessing(false);
      return;
    }

    const requiredFields = [
      'firstName', 'lastName', 'streetAddress', 
      'postalCode', 'city', 'province', 'phoneNumber'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill out: ${missingFields.join(', ')}`);
      setIsProcessing(false);
      return;
    }

    // Validate phone number format
    if (!/^\d{10,15}$/.test(formData.phoneNumber)) {
      toast.error("Please enter a valid phone number (10-15 digits)");
      setIsProcessing(false);
      return;
    }

    const orderItems = cart.map(item => ({
      productId: item.productId || item.id,
      stockQuantity: item.quantity,
      price: item.price
    }));

    const shippingAddress = `${formData.streetAddress}, ${formData.city}, ${formData.province}, ${formData.postalCode}`;

    const orderResponse = await createOrder(
      orderItems,
      shippingAddress,
      token
    );

    if (orderResponse.data?.paymentUrl) {
      window.location.href = orderResponse.data.paymentUrl;
    } else {
      throw new Error("Payment URL is missing in the response.");
    }
  } catch (error) {
    console.error("Checkout error:", error);
    toast.error(error.message || "Checkout failed. Please try again.");
    setIsProcessing(false);
  }
};

// Update the submit button
<button
  type="submit"
  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 flex justify-center items-center"
  disabled={isProcessing}
>
  {isProcessing ? (
    <>
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Processing...
    </>
  ) : (
    "Proceed to Payment"
  )}
</button>
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
