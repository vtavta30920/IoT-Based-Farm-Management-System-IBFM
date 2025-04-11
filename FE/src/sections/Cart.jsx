import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../contexts/CartContext";
import { FaTrash, FaEdit, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, clearCart } =
    useContext(CartContext);
  const [quantities, setQuantities] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  // Format price to VND
  const formatVND = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Initialize quantities state with cart items
  useEffect(() => {
    const initialQuantities = {};
    cart.forEach((item) => {
      initialQuantities[item.productName] = item.quantity;
    });
    setQuantities(initialQuantities);
  }, [cart]);

  // Handle quantity change with validation
  const handleQuantityChange = (productName, newQuantity) => {
    const num = parseInt(newQuantity, 10);
    if (num > 0 && num <= 999) {
      // Set reasonable limits
      setQuantities((prev) => ({
        ...prev,
        [productName]: num,
      }));
    } else if (newQuantity === "") {
      setQuantities((prev) => ({
        ...prev,
        [productName]: "",
      }));
    }
  };

  // Handle update quantity with loading state
  const handleUpdateQuantity = async (productName) => {
    const newQuantity = parseInt(quantities[productName], 10);

    if (isNaN(newQuantity) || newQuantity < 1) {
      toast.error("Please enter a valid quantity (1-999).");
      return;
    }

    setIsUpdating(true);
    try {
      await updateCartItem(productName, newQuantity);
      toast.success(`${productName} quantity updated.`);
    } catch (error) {
      toast.error("Failed to update quantity. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Calculate total price and item count
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty. Add some products before checkout.");
      return;
    }
    navigate("/checkout");
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    navigate("/products"); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with navigation */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleContinueShopping}
            className="flex items-center text-green-600 hover:text-green-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Continue Shopping
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Your Shopping Cart
          </h1>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {/* Empty cart state */}
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaShoppingCart className="mx-auto text-6xl text-gray-300 mb-6" />
            <h2 className="text-2xl font-medium text-gray-700 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added any items yet
            </p>
            <Link
              to="/products"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart items list */}
            <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
              {cart.map((item, index) => (
                <div
                  key={`${item.productName}-${index}`}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Product info */}
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
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
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.productName}
                        </h3>
                        <p className="text-green-600 font-medium">
                          {formatVND(item.price)}
                        </p>
                        {item.inStock !== undefined && (
                          <p
                            className={`text-sm ${
                              item.inStock ? "text-gray-500" : "text-red-500"
                            }`}
                          >
                            {item.inStock ? "In Stock" : "Out of Stock"}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <label
                          htmlFor={`quantity-${index}`}
                          className="sr-only"
                        >
                          Quantity
                        </label>
                        <input
                          id={`quantity-${index}`}
                          type="number"
                          value={quantities[item.productName] || ""}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.productName,
                              e.target.value
                            )
                          }
                          onBlur={() => handleUpdateQuantity(item.productName)}
                          className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                          min="1"
                          max="999"
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => removeFromCart(item.productName)}
                          className="p-2 text-red-600 hover:text-red-800 transition-colors"
                          aria-label="Remove item"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {itemCount} {itemCount === 1 ? "Item" : "Items"}
                  </span>
                  <span className="font-medium">{formatVND(totalPrice)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-4">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatVND(totalPrice)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={clearCart}
                  className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
