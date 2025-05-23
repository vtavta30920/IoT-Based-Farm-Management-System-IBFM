import React from "react";
import { motion } from "framer-motion";
import { slideUpVariants, zoomInVariants } from "../../../components/animation";
import { Link } from "react-router-dom";
const About = () => {
  return (
    <div
      className="lg:w-[80%] w-[90%] m-auto py-[60px] flex lg:flex-row flex-col justify-between items-start gap-[50px]"
      id="about"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={slideUpVariants}
        className="lg:w-60%] w-full flex flex-col justify-center items-start gap-6"
      >
        <motion.h1
          variants={slideUpVariants}
          className="text-white uppercase text-[40px] font-bold"
        >
          IoT Farm website
        </motion.h1>
        <div className="w-[120px] h-[6px] bg-green-500"></div>
        <p className="text-3x1 italic text-gray-50 mt-[60px]">
          We believe in sustainable farming practices that protect our planet
          and ensure a healthy future for generations to come.
        </p>
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={slideUpVariants}
        className="lg:w[-40%] w-full flex flex-col justify-center items-start gap-6"
      >
        <p className="text-white text-lg text-justify">
          IoT Farm is a pioneering IoT-enabled farm dedicated to revolutionizing
          the agriculture industry. We leverage cutting-edge technology to
          cultivate high-quality, sustainable produce while minimizing our
          environmental footprint. Our state-of-the-art facility integrates a
          network of sensors, automation systems, and data analytics to optimize
          every aspect of the farming process.
        </p>
        <motion.button
          variants={zoomInVariants}
          className="bg-green-500 hover:bg-white hover:text-black px-10 py-3 rounded-lg font-bold text-black"
        >
          <Link to="/read-more">READ MORE</Link>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default About;
