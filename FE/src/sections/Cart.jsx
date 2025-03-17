import React, { useContext } from "react";
import { CartContext } from "../CartContext";

const Cart = () => {
  const { cart } = useContext(CartContext);

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-green-600 mb-6">Your Cart</h1>
      <div className="w-full max-w-4xl">
        {cart.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h2 className="text-xl font-semibold mb-2">{item.productName}</h2>
            <p className="text-gray-600 mb-4">Price: ${item.price}</p>
            <p className="text-gray-600 mb-4">Quantity: {item.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
