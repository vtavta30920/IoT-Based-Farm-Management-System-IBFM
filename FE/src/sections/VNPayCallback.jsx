import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const VNPayCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const vnp_ResponseCode = queryParams.get("vnp_ResponseCode");

    if (vnp_ResponseCode === "00") {
      toast.success("Payment successful!");
      navigate("/order-success"); // Redirect to order success page
    } else {
      toast.error("Payment failed. Please try again.");
      navigate("/checkout"); // Redirect back to checkout
    }
  }, [location, navigate]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-semibold text-gray-700">
        Processing payment...
      </h1>
    </div>
  );
};

export default VNPayCallback;
