import React from "react";

const Products = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-green-600 mb-6">Our Products</h1>
      <p className="text-lg text-gray-700 text-center max-w-2xl">
        Explore our premium, IoT-powered fresh produce and innovative farming
        solutions.
      </p>
      {/* Add product cards or sections here */}
    </div>
  );
};

export default Products;
