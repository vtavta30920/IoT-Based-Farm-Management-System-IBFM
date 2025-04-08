import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { UserContext } from "../contexts/UserContext";
import { createOrder } from "../api/api";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

const Checkout = () => {
  const { cart } = useContext(CartContext);
  const { user, token } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    streetAddress: "",
    ward: "",
    district: "",
    city: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleBacktoCart = () => {
    navigate(-1); // Go back to previous page
  };
  const [isProcessing, setIsProcessing] = useState(false);

  const formatVND = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateSubtotal = (price, quantity) => {
    return price * quantity;
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + calculateSubtotal(item.price, item.quantity),
      0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
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
        "firstName",
        "lastName",
        "streetAddress",
        "ward",
        "district",
        "city",
        "phoneNumber",
      ];

      const missingFields = requiredFields.filter((field) => !formData[field]);
      if (missingFields.length > 0) {
        toast.error(`Please fill out: ${missingFields.join(", ")}`);
        setIsProcessing(false);
        return;
      }

      if (!/^\d{10,15}$/.test(formData.phoneNumber)) {
        toast.error("Please enter a valid phone number (10-15 digits)");
        setIsProcessing(false);
        return;
      }

      const orderItems = cart.map((item) => ({
        productId: item.productId || item.id,
        stockQuantity: item.quantity,
        price: item.price,
      }));

      const shippingAddress = `${formData.streetAddress}, ${formData.ward}, ${formData.district}, ${formData.city}`;

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

  const vietnamCities = [
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bạc Liêu",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Định",
    "Bình Dương",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cần Thơ",
    "Cao Bằng",
    "Đà Nẵng",
    "Đắk Lắk",
    "Đắk Nông",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Nội",
    "Hà Tĩnh",
    "Hải Dương",
    "Hải Phòng",
    "Hậu Giang",
    "Hòa Bình",
    "Hưng Yên",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lâm Đồng",
    "Lạng Sơn",
    "Lào Cai",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Phú Yên",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "TP Hồ Chí Minh",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-8 text-center">
          Checkout
        </h1>
        <button
          onClick={handleBacktoCart}
          className="flex items-center text-green-600 hover:text-green-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back To Cart
        </button>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Checkout Process
            </h2>
            <div className="flex mt-4">
              <div className="flex-1 border-t-2 border-green-600 pt-2">
                <p className="text-sm font-medium text-green-600">
                  1. Shipping Information
                </p>
              </div>
              <div className="flex-1 border-t-2 border-gray-200 pt-2">
                <p className="text-sm font-medium text-gray-500">2. Payment</p>
              </div>
              <div className="flex-1 border-t-2 border-gray-200 pt-2">
                <p className="text-sm font-medium text-gray-500">
                  3. Confirmation
                </p>
              </div>
            </div>
          </div>

          <div className="md:flex">
            {/* Shipping Information Form */}
            <form
              onSubmit={handleSubmit}
              className="w-full md:w-1/2 p-6 border-r border-gray-200"
            >
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Shipping Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                  placeholder="123 street ABC"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ward *
                  </label>
                  <input
                    type="text"
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                    placeholder="Enter ward"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                    placeholder="Enter district"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Select City</option>
                    {vietnamCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                  placeholder="0987654321"
                />
              </div>
            </form>

            {/* Order Summary */}
            <div className="w-full md:w-1/2 p-6 bg-gray-50">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start border-b border-gray-200 pb-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white border border-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                        <img
                          src={
                            item.image ||
                            "https://dalattungtrinh.vn/wp-content/uploads/2024/08/rau-romain-1.jpg"
                          }
                          alt={item.productName}
                          className="h-20 w-20 rounded-md object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatVND(
                          calculateSubtotal(item.price, item.quantity)
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatVND(item.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
                  <span className="text-base font-bold text-gray-900">
                    Total
                  </span>
                  <span className="text-base font-bold text-green-600">
                    {formatVND(calculateTotal())}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <img
                      src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                      alt="VNPay"
                      className="h-5 mr-2"
                    />
                    Proceed to Payment
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Secure checkout with VNPay
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
