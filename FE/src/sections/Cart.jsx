import React, { useContext, useState } from "react";
import { CartContext } from "../CartContext";
import { FaTrash, FaEdit, FaShoppingCart } from "react-icons/fa"; // Import icons
import { toast } from "react-toastify";

const Cart = () => {
  const { cart, updateCartItem, removeFromCart } = useContext(CartContext);
  const [quantities, setQuantities] = useState({});

  // Initialize quantities state with cart items
  React.useEffect(() => {
    const initialQuantities = {};
    cart.forEach((item) => {
      initialQuantities[item.productName] = item.quantity;
    });
    setQuantities(initialQuantities);
  }, [cart]);

  // Handle quantity change
  const handleQuantityChange = (productName, newQuantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productName]: newQuantity,
    }));
  };

  // Handle update quantity
  const handleUpdateQuantity = (productName) => {
    const newQuantity = parseInt(quantities[productName], 10);
    if (!isNaN(newQuantity)) {
      updateCartItem(productName, newQuantity);
      toast.success(`${productName} quantity updated.`);
    } else {
      toast.error("Please enter a valid quantity.");
    }
  };

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-green-600 mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <FaShoppingCart className="text-6xl text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">Your cart is empty.</p>
          <p className="text-gray-500">Start adding some products!</p>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          {cart.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">
                    {item.productName}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Price: ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <label className="text-gray-600 mr-2">Quantity:</label>
                    <input
                      type="number"
                      value={quantities[item.productName] || 1}
                      onChange={(e) =>
                        handleQuantityChange(item.productName, e.target.value)
                      }
                      className="w-16 p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                      min="1"
                    />
                  </div>
                  <button
                    onClick={() => handleUpdateQuantity(item.productName)}
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300 flex items-center"
                  >
                    <FaEdit className="mr-2" /> Update
                  </button>
                  <button
                    onClick={() => removeFromCart(item.productName)}
                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300 flex items-center"
                  >
                    <FaTrash className="mr-2" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">
              Order Summary
            </h2>
            <div className="flex justify-between items-center">
              <p className="text-xl text-gray-700">Total Price:</p>
              <p className="text-2xl font-bold text-green-600">
                ${totalPrice.toFixed(2)}
              </p>
            </div>
            <button
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 mt-6"
              onClick={() =>
                toast.info("Proceed to checkout (not implemented).")
              }
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
