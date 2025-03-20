import React from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-green-600 mb-6">
        Order Successful!
      </h1>
      <p className="text-xl text-gray-700 mb-8">Thank you for your purchase.</p>
      <button
        onClick={() => navigate("/")}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderSuccess;
