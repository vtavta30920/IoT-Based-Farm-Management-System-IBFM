import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { slideUpVariants, zoomInVariants } from "../../../components/animation";
import { getProducts } from "../../../api/api";

const OurProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " VND";
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data.items);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-white py-[60px] text-center">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white py-[60px] text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div id="ourproducts" className="w-full bg-white">
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={slideUpVariants}
        className="lg:w-[80%] w-[90%] m-auto py-[60px] flex flex-col justify-between items-center gap-[20px]"
      >
        <motion.h1
          variants={slideUpVariants}
          className="text-green-500 text-2xl"
        >
          PRODUCTS
        </motion.h1>
        <motion.h1
          variants={slideUpVariants}
          className="text-black uppercase text-[40px] font-bold text-center"
        >
          OUR PRODUCTS
        </motion.h1>
        <motion.div
          variants={slideUpVariants}
          className="w-20 h-1 bg-green-600 rounded-full"
        ></motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={zoomInVariants}
          className="w-full grid lg:grid-cols-3 xl:grid-cols-3 gap-8 mt-12"
        >
          {products.map((product) => (
            <motion.div
              variants={zoomInVariants}
              className="flex flex-col items-center p-10 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
              key={product.productId}
            >
              <img
                src={product.images}
                alt={product.productName}
                className="w-20 h-20 mb-6 border-4 border-green-600 rounded-full p-3 hover:bg-green-100 transition-colors duration-300"
              />
              <div className="text-center">
                <h1 className="text-xl font-bold text-gray-900 mb-2">
                  {product.productName}
                </h1>
                <p className="text-gray-600 text-lg">
                  {formatPrice(product.price)}
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  {product.description}
                </p>
                {/* <p className="text-gray-500 text-sm mt-2">
                  In stock: {product.stockQuantity}
                </p> */}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OurProducts;
