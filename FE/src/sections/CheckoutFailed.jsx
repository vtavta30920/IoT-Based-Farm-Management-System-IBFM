import React from "react";
import { useNavigate } from "react-router-dom";

const CheckoutFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-red-600 mb-6">
        Payment Failed!
      </h1>
      <p className="text-xl text-gray-700 mb-8">
        There was an issue processing your payment. Please try again.
      </p>
      <button
        onClick={() => navigate("/cart")}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
      >
        Back to Cart
      </button>
    </div>
  );
};

export default CheckoutFailed;