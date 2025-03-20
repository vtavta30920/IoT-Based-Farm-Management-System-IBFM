import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { UserContext } from "./UserContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.email}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } else {
      setCart([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (product) => {
    if (!user) {
      toast.error("You must be logged in to add items to the cart.");
      return;
    }

    console.log("Product Received by addToCart:", product); // Log incoming product
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
      const newItem = {
        ...product,
        productId: product.productId || product.id, // Ensure productId is set
        quantity: 1,
      };
      console.log("New Cart Item:", newItem); // Log new item
      toast.success(`${product.productName} added to cart.`);
      const updatedCart = [...prevCart, newItem];
      console.log("Updated Cart:", updatedCart); // Log updated cart
      return updatedCart;
    });
  };

  const updateCartItem = (productName, newQuantity) => {
    if (newQuantity < 1) {
      toast.error("Quantity must be at least 1.");
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productName === productName
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    toast.success(`${productName} quantity updated.`);
  };

  const removeFromCart = (productName) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productName !== productName)
    );
    toast.success(`${productName} removed from cart.`);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateCartItem, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
