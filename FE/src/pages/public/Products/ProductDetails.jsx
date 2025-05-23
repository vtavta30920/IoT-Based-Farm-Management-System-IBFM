import React from "react";
import { useParams } from "react-router-dom";
import { allservices } from "../../../export";

const ProductDetails = () => {
  const { title } = useParams(); // Get the product title from the URL
  const product = allservices.find((p) => p.title === title); // Find the product

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-100 p-10">
      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl w-full">
        <img
          src={product.icon}
          alt={product.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-700 mb-4">{product.about}</p>
          <p className="text-xl font-bold mb-4">{product.price}</p>
          <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
