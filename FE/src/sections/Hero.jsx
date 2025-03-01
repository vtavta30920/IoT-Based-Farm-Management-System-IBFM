import React from "react";
import heroimg from "../assets/heroimg.png";
import backgroundImage from "../assets/homeimg.webp";
import { motion } from "framer-motion";
import { slideUpVariants, zoomInVariants } from "./animation";
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <div
      id="hero"
      className="bg-black w-full lg:h-[700px] h-fit m-auto pt-[60px] lg:pt-[0px] lg:px-[150px] px-[20px] flex justify-between items-center lg:flex-row flex-col lg:gap-5 gap-[50px] bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={slideUpVariants}
        className="lg:w-[60%] w-full flex flex-col justify-center items-start lg:gap-8 gap-4"
      >
        <motion.h1
          variants={slideUpVariants}
          className="text-green-500 text-2x1"
        >
          WE ARE IOT FARM{" "}
        </motion.h1>
        <motion.h1
          variants={slideUpVariants}
          className="text-white uppercase text-[50px] font-bold"
        >
          IoT-Powered Produce, Naturally Grown
        </motion.h1>
        <div className="w-[120px] h-[6px] bg-green-500"></div>
        <p className="text-white text-[20px]">
          At IoT farm, we're passionate about revolutionizing the way we grow
          and consume food. By harnessing the power of the Internet of Things
          (IoT), we've created a smart farm that delivers fresh, high-quality
          produce while minimizing our environmental impact.
        </p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={zoomInVariants}
          className="flex justify-center items-center gap-5"
        >
          <motion.button
            variants={zoomInVariants}
            className="bg-green-500 hover:bg-white hover:text-black px-10 py-3 rounded-lg text-black font-bold"
          >
            <Link to="/read-more">READ MORE</Link>
          </motion.button>
        </motion.div>
      </motion.div>
      <div className="w-[40%] flex flex-col justify-end items-end">
        <motion.img
          initial="hidden"
          whileInView="visible"
          variants={zoomInVariants}
          src={heroimg}
          alt="hero image"
          className="lg-h[600px] h-300px lg:mb-[-100px]"
        />
      </div>
    </div>
  );
};

export default Hero;
