import React from "react";
import { allservices } from "../export";
import { Link } from "react-router-dom"; 
const Products = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-green-600 mb-6">Our Products</h1>
      <p className="text-lg text-gray-700 text-center max-w-2xl mb-8">
        Explore our premium, IoT-powered fresh produce and innovative farming
        solutions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {allservices.map((product, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={product.icon}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <p className="text-gray-600 mb-4">{product.about}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">{product.price}</span>
                <Link
                  to={`/products/${product.title}`} // Dynamic route for product details
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
