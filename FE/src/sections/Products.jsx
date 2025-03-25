import React, { useEffect, useState, useContext } from "react";
import { getProducts } from "../api/api";
import { CartContext } from "../CartContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const [isAdding, setIsAdding] = useState(false);

  // Format price with VND unit (no conversion)
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' VND';
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        console.log("Raw Products API Response:", data.data.items);
        const normalizedProducts = data.data.items.map((product) => {
          const normalized = {
            ...product,
            productId: product.id || product.productId,
            imageUrl: product.imageUrl || "https://via.placeholder.com/150"
          };
          return normalized;
        });
        setProducts(normalizedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (isAdding) return;
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

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
              src={product.imageUrl}
              alt={product.productName}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150";
              }}
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">
                {product.productName}
              </h2>
              <p className="text-gray-600 mb-4">Price: {formatPrice(product.price)}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">
                  Stock: {product.stockQuantity}
                </span>
                <button
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
                  onClick={() => handleAddToCart(product)}
                  disabled={isAdding}
                >
                  {isAdding ? "Adding..." : "Add to Cart"}
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