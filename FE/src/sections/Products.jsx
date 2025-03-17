import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/api";
import { CartContext } from "../CartContext"; // Import the CartContext

const Products = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext); // Use the CartContext

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.data.items);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-green-600 mb-6">Our Products</h1>
      <p className="text-lg text-gray-700 text-center max-w-2xl mb-8">
        Explore our premium, IoT-powered fresh produce and innovative farming
        solutions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {products.map((product, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src="https://via.placeholder.com/150" // Replace with actual product image URL if available
              alt={product.productName}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">
                {product.productName}
              </h2>
              <p className="text-gray-600 mb-4">Price: ${product.price}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">
                  Stock: {product.stockQuantity}
                </span>
                <button
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
