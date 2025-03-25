import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { handleVNPayCallback } from "../api/api";

const VNPayCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const queryParams = location.search;
        if (!queryParams) {
          throw new Error("No callback parameters received");
        }

        const response = await handleVNPayCallback(queryParams);
        
        // Ensure success is properly evaluated
        const isSuccess = response.success || (response.payment && response.payment.success);
        
        if (isSuccess) {
          const paymentData = response.payment || response;
          toast.success(response.message || "Payment successful!");
          navigate("/order-success", {
            state: {
              orderId: paymentData.orderId,
              amount: paymentData.amount,
              transactionId: paymentData.transactionId,
            },
          });
        } else {
          const errorMsg = response.message || "Payment failed";
          toast.error(errorMsg);
          navigate("/order-failed", {
            state: {
              error: errorMsg,
              orderId: response.orderId || (response.payment && response.payment.orderId),
            },
          });
        }
      } catch (error) {
        console.error("Payment processing error:", error);
        toast.error(error.message || "Error processing payment");
        navigate("/order-failed", {
          state: {
            error: error.message || "Payment processing error",
          },
        });
      }
    };

    processCallback();
  }, [location, navigate]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-semibold text-gray-700">
        Processing payment...
      </h1>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mt-4"></div>
    </div>
  );
};

export default VNPayCallback;