import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { UserContext } from "./UserContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useContext(UserContext);

  // Load cart from local storage when the user logs in
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.email}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } else {
      setCart([]); // Clear cart if user logs out
    }
  }, [user]);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  // Add item to cart
  const addToCart = (product) => {
    if (!user) {
      toast.error("You must be logged in to add items to the cart.");
      return;
    }

    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.productName === product.productName
      );
      if (existingProduct) {
        toast.success(`${product.productName} quantity updated in cart.`);
        return prevCart.map((item) =>
          item.productName === product.productName
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success(`${product.productName} added to cart.`);
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Update item quantity in cart
  const updateCartItem = (productName, newQuantity) => {
    if (newQuantity < 1) {
      toast.error("Quantity must be at least 1.");
      return;
    }

    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.productName === productName
          ? { ...item, quantity: newQuantity }
          : item
      );
      toast.success(`${productName} quantity updated.`);
      return updatedCart;
    });
  };

  // Remove item from cart
  const removeFromCart = (productName) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(
        (item) => item.productName !== productName
      );
      toast.success(`${productName} removed from cart.`);
      return updatedCart;
    });
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateCartItem, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
