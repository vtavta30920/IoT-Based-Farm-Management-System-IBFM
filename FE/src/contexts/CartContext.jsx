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

  const toastIdRef = React.useRef(null);
  const addToCart = (product) => {
    if (!user) {
      if (!toast.isActive(toastIdRef.current)) {
        toastIdRef.current = toast.error(
          "You must be logged in to add items to the cart."
        );
      }
      return;
    }

    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.productName === product.productName
      );

      if (existingProduct) {
        if (!toast.isActive(toastIdRef.current)) {
          toastIdRef.current = toast.success(
            `${product.productName} quantity updated in cart.`
          );
        }
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
      if (!toast.isActive(toastIdRef.current)) {
        toastIdRef.current = toast.success(
          `${product.productName} added to cart.`
        );
      }
      return [...prevCart, newItem];
    });
  };

  const updateCartItem = (productName, newQuantity) => {
    if (newQuantity < 1) {
      return { success: false, message: "Quantity must be at least 1." };
    }

    let updated = false;
    let message = "";

    setCart((prevCart) => {
      const itemToUpdate = prevCart.find(
        (item) => item.productName === productName
      );

      if (!itemToUpdate) {
        message = "Product not found in cart";
        return prevCart;
      }

      if (newQuantity > itemToUpdate.stockQuantity) {
        message = `Only ${itemToUpdate.stockQuantity} available in stock.`;
        return prevCart;
      }

      updated = true;
      return prevCart.map((item) =>
        item.productName === productName
          ? { ...item, quantity: newQuantity }
          : item
      );
    });

    return {
      success: updated,
      message: updated ? "" : message,
    };
  };

  const removeFromCart = (productName) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productName !== productName)
    );
    toast.success(`${productName} removed from cart.`);
  };

  const clearCart = () => {
    setCart([]);
    if (user) {
      localStorage.removeItem(`cart_${user.email}`);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateCartItem, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
