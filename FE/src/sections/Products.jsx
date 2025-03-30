import React, { useEffect, useState, useContext } from "react";
import { getProducts } from "../api/api";
import { CartContext } from "../CartContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [quantities, setQuantities] = useState({});

  // Format price with VND unit
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " VND";
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        console.log("Raw Products API Response:", data.data.items);
        const normalizedProducts = data.data.items.map((product) => {
          // Extract category from product name (simple approach)
          const category = product.productName.toLowerCase().includes("fruit")
            ? "fruit"
            : "vegetable";

          const normalized = {
            ...product,
            productId: product.id || product.productId,
            imageUrl:
              product.imageUrl ||
              `https://source.unsplash.com/random/300x200/?${product.productName}`,
            category,
          };
          return normalized;
        });

        setProducts(normalizedProducts);
        setFilteredProducts(normalizedProducts);

        // Initialize quantities
        const initialQuantities = {};
        normalizedProducts.forEach((product) => {
          initialQuantities[product.productId] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Apply filters and sorting whenever products, selectedCategory, or sortOption changes
  useEffect(() => {
    let result = [...products];

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case "name-desc":
        result.sort((a, b) => b.productName.localeCompare(a.productName));
        break;
      default:
        // Default sorting (perhaps by productId)
        result.sort((a, b) => a.productId - b.productId);
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, sortOption]);

  const handleAddToCart = (product) => {
    if (isAdding) return;
    setIsAdding(true);

    // Add the selected quantity to cart
    const productWithQuantity = {
      ...product,
      quantity: quantities[product.productId] || 1,
    };

    addToCart(productWithQuantity);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    // Ensure quantity is at least 1 and doesn't exceed available stock
    const product = products.find((p) => p.productId === productId);
    if (product) {
      newQuantity = Math.max(1, Math.min(newQuantity, product.stockQuantity));
      setQuantities((prev) => ({
        ...prev,
        [productId]: newQuantity,
      }));
    }
  };

  const incrementQuantity = (productId) => {
    handleQuantityChange(productId, (quantities[productId] || 1) + 1);
  };

  const decrementQuantity = (productId) => {
    handleQuantityChange(productId, (quantities[productId] || 1) - 1);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-100 p-4 md:p-10">
      <h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-6">
        Our Products
      </h1>
      <p className="text-lg text-gray-700 text-center max-w-2xl mb-8">
        Explore our premium, IoT-powered fresh produce and innovative farming
        solutions.
      </p>

      {/* Filter and Sort Controls */}
      <div className="w-full max-w-6xl mb-8 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <label htmlFor="category-filter" className="font-medium">
            Category:
          </label>
          <select
            id="category-filter"
            className="border rounded p-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All</option>
            <option value="vegetable">Vegetables</option>
            <option value="fruit">Fruits</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="sort-option" className="font-medium">
            Sort by:
          </label>
          <select
            id="sort-option"
            className="border rounded p-2"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {filteredProducts.map((product) => (
          <div
            key={product.productId}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://source.unsplash.com/random/300x200/?vegetable";
              }}
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">
                {product.productName}
              </h2>
              <p className="text-gray-600 mb-1">
                Price: {formatPrice(product.price)}
              </p>
              <p className="text-gray-600 mb-4">
                Category:{" "}
                {product.category.charAt(0).toUpperCase() +
                  product.category.slice(1)}
              </p>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">
                    Stock: {product.stockQuantity}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      className="bg-gray-200 text-gray-800 w-8 h-8 rounded flex items-center justify-center hover:bg-gray-300"
                      onClick={() => decrementQuantity(product.productId)}
                      disabled={quantities[product.productId] <= 1}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">
                      {quantities[product.productId] || 1}
                    </span>
                    <button
                      className="bg-gray-200 text-gray-800 w-8 h-8 rounded flex items-center justify-center hover:bg-gray-300"
                      onClick={() => incrementQuantity(product.productId)}
                      disabled={
                        quantities[product.productId] >= product.stockQuantity
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300 disabled:bg-gray-400"
                  onClick={() => handleAddToCart(product)}
                  disabled={isAdding || product.stockQuantity === 0}
                >
                  {product.stockQuantity === 0
                    ? "Out of Stock"
                    : isAdding
                    ? "Adding..."
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">
            No products match your filters.
          </p>
          <button
            className="mt-4 text-green-600 underline"
            onClick={() => {
              setSelectedCategory("all");
              setSortOption("default");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
