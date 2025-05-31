import React, { useEffect, useState, useContext } from "react";
import { getProducts } from "../../../api/api";
import { CartContext } from "../../../contexts/CartContext";
import { useGetFeedbackByProduct } from "../../../api/FeedbackEndPoint";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [quantities, setQuantities] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Feedback modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " VND";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products
        const productsData = await getProducts();
        console.log("Raw Products API Response:", productsData.data.items);

        // Fetch categories (you'll need to implement this API call)
        const categoriesResponse = await fetch(
          "https://localhost:7067/api/v1/category/get-all"
        );
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Map products with proper category information
        const normalizedProducts = productsData.data.items.map((product) => {
          // Find the matching category
          const category = categoriesData.find(
            (cat) => cat.categoryName === product.categoryname
          );

          return {
            ...product,
            productId: product.id || product.productId,
            imageUrl: product.images,
            category: category
              ? {
                  id: category.categoryId,
                  name: category.categoryName.split(" - ")[0], // Take the English part
                  fullName: category.categoryName,
                }
              : {
                  id: 0,
                  name: "Unknown",
                  fullName: "Unknown Category",
                },
          };
        });

        setProducts(normalizedProducts);
        setFilteredProducts(normalizedProducts);

        const initialQuantities = {};
        normalizedProducts.forEach((product) => {
          initialQuantities[product.productId] = Math.min(
            1,
            product.stockQuantity
          );
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category.id.toString() === selectedCategory
      );
    }

    // Sort products
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
      case "stock-high":
        result.sort((a, b) => b.stockQuantity - a.stockQuantity);
        break;
      default:
        // Default sorting (by productId)
        result.sort((a, b) => a.productId - b.productId);
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, sortOption]);

  const handleAddToCart = (product) => {
    if (isAdding || product.stockQuantity === 0) return;
    setIsAdding(true);

    const productWithQuantity = {
      ...product,
      quantity: quantities[product.productId] || 1,
    };

    addToCart(productWithQuantity);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const product = products.find((p) => p.productId === productId);
    if (!product) return;

    newQuantity = Math.max(1, Math.min(newQuantity, product.stockQuantity));
    setQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
  };

  // Feedback hook (không phân trang)
  const {
    data: feedbackData,
    isLoading: feedbackLoading,
    isError: feedbackError,
  } = useGetFeedbackByProduct(selectedProductId);

  // Chuẩn hóa feedbacks
  let feedbacks = [];
  if (Array.isArray(feedbackData?.data)) {
    feedbacks = feedbackData.data;
  } else if (Array.isArray(feedbackData?.items)) {
    feedbacks = feedbackData.items;
  } else if (Array.isArray(feedbackData?.data?.items)) {
    feedbacks = feedbackData.data.items;
  } else if (Array.isArray(feedbackData)) {
    feedbacks = feedbackData;
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-100 p-4 md:p-10">
      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-green-700 text-center">
              Product Feedback
            </h2>
            {feedbackLoading ? (
              <div className="text-center py-6">Loading feedback...</div>
            ) : feedbackError ? (
              <div className="text-center text-red-500 py-6">
                Error loading feedback.
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                No feedback for this product.
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {feedbacks.map((fb, idx) => (
                  <div
                    key={idx}
                    className="border-b pb-3 mb-3 last:border-b-0 last:mb-0"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-green-700">
                        {fb.email}
                      </span>
                      <span className="flex items-center ml-2">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            style={{
                              color:
                                i < (fb.rating || 0) ? "#fbbf24" : "#d1d5db",
                              fontSize: "1.1em",
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </span>
                    </div>
                    <div className="text-gray-700 whitespace-pre-line break-words">
                      {fb.comment}
                    </div>
                    {fb.createdAt && (
                      <div className="text-xs text-gray-400 mt-1">
                        {`Created at: ${new Date(fb.createdAt).toLocaleString(
                          "vi-VN"
                        )}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* Xóa phân trang trong modal */}
            <div className="flex justify-end mt-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => setShowFeedbackModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-6">
        Our Products
      </h1>
      <p className="text-lg text-gray-700 text-center max-w-2xl mb-8">
        Explore our premium, IoT-powered fresh produce and innovative farming
        solutions.
      </p>

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
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName.split(" - ")[0]}
              </option>
            ))}
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
            <option value="stock-high">Stock: High to Low</option>
          </select>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {filteredProducts.map((product) => (
            <div
              key={product.productId}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
            >
              <button
                className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded shadow font-semibold text-xs hover:bg-green-700 transition z-10 border border-green-700"
                onClick={() => {
                  setSelectedProductId(product.productId);
                  setShowFeedbackModal(true);
                }}
              >
                Feedback
              </button>
              <img
                src={product.imageUrl}
                alt={product.productName}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://dalattungtrinh.vn/wp-content/uploads/2024/08/rau-romain-1.jpg";
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
                  Category: {product.category.name}
                </p>
                <p className="text-gray-600 mb-4 text-sm">
                  {product.description}
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-lg font-bold ${
                        product.stockQuantity === 0
                          ? "text-red-500"
                          : "text-gray-700"
                      }`}
                    >
                      Stock: {product.stockQuantity}
                    </span>
                  </div>
                  <button
                    className={`w-full py-2 px-4 rounded transition duration-300 ${
                      product.stockQuantity === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
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
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">
            No products match your filters.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
