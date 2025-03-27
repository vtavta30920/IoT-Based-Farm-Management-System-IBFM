import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const VnPayCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const responseCode = queryParams.get("vnp_ResponseCode");
    const transactionId = queryParams.get("vnp_TransactionNo");
    const orderId = queryParams.get("vnp_TxnRef");
    const amount = queryParams.get("vnp_Amount");

    if (responseCode === "00") {
      // Successful payment
      navigate("/order-success", {
        state: { orderId, amount, transactionId },
      });
    } else {
      // Failed payment
      navigate("/order-failed", {
        state: { orderId, error: "Payment was not successful." },
      });
    }
  }, [location, navigate]);

  return <div>Processing payment...</div>;
};

export default VnPayCallback;
