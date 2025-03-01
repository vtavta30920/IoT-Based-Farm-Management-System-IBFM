import React from "react";
import { motion } from "framer-motion";
import { slideUpVariants, zoomInVariants } from "./animation";
import { allservices } from "../export";

const OurProducts = () => {
  return (
    <div id="ourproducts" className="w-full bg-white">
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={slideUpVariants}
        className="lg:w-[80%] w-[90%] m-auto py-[60px] flex flex-col justify-between items-centergap-[20px]"
      >
        <motion.h1
          variants={slideUpVariants}
          className="text-green-500 text-2x1"
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
          className="w-20 h-1 bg-green-600 rounded-full" // Increased width and made rounded-full
        ></motion.div>

        {/* make div for services mapping from export */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={zoomInVariants}
          className="w-full grid lg:grid-cols-3 xl:grid-cols-3 gap-8 mt-12" // Increased gap and added xl grid
        >
          {allservices.map((item, index) => (
            <motion.div
              variants={zoomInVariants}
              className="flex flex-col items-center p-10 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300" // Added shadow and hover effect
              key={index}
            >
              <img
                src={item.icon}
                alt="icon"
                className="w-20 h-20 mb-6 border-4 border-green-600 rounded-full p-3 hover:bg-green-100 transition-colors duration-300" // Increased size and added hover effect
              />
              <div className="text-center">
                <h1 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h1>
                <p className="text-gray-600 text-lg">{item.about}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OurProducts;
