import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, amount, transactionId } = location.state || {};

  // Format amount (VNPay returns amount multiplied by 100)
  const formatAmount = (amt) => {
    if (!amt) return '0.00';
    // Check if amount is in VNPay format (like 6000000 for 60,000.00)
    return amt > 1000 ? (amt / 100).toFixed(2) : amt.toFixed(2);
  };

  const formattedAmount = formatAmount(amount);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-green-600 mb-4">Order Confirmed!</h1>
        
        {orderId && (
          <div className="mb-4">
            <p className="text-gray-700">Order Number:</p>
            <p className="text-xl font-semibold">{orderId}</p>
          </div>
        )}
        
        {transactionId && (
          <div className="mb-4">
            <p className="text-gray-700">Transaction ID:</p>
            <p className="text-lg">{transactionId}</p>
          </div>
        )}
        
        <div className="mb-6">
          <p className="text-gray-700">Amount Paid:</p>
          <p className="text-2xl font-bold">${formattedAmount}</p>
        </div>
        
        <p className="text-gray-600 mb-6">
          Thank you for your purchase! A confirmation email has been sent to you.
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/products")}
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition"
          >
            Continue Shopping
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;