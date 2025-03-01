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
          className="w-[120px] h-[6px] bg-green-500"
        ></motion.div>

        {/* make div for services mapping from export */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={zoomInVariants}
          className="w-full grid lg:grid-cols-3 grid-cols-1 justify-center items-start gap-[20px] mt-[30px]"
        >
          {allservices.map((item, index) => (
            <motion.div
              variants={zoomInVariants}
              className="flex justify-center items-startgap-5 p-8"
              key={index}
            >
              <img
                src={item.icon}
                alt="icon"
                className="w-[70px] border-2 border-green-500 hover:bg-green-500 rounded-lg p-2"
              />
              <div className="flex flex-col justify-center items-start gap-3">
                <h1 className="text-x1 font-bold text-black"> {item.title}</h1>
                <p>{item.about}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OurProducts;
