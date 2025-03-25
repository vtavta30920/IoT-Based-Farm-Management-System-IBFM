// OrderFailed.jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const OrderFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { error, orderId } = location.state || {};

  useEffect(() => {
    toast.error(error || "Payment failed. Please try again.");
  }, [error]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
        {orderId && (
          <p className="text-gray-700 mb-4">
            Order ID: <span className="font-semibold">{orderId}</span>
          </p>
        )}
        <p className="text-gray-600 mb-6">
          We couldn't process your payment. Please try again or contact support.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/checkout")}
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="bg-gray-600 text-white py-2 px-6 rounded hover:bg-gray-700 transition"
          >
            View Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFailed;