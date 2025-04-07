import xalach from "../src/assets/xalach.png";
import caingot from "../src/assets/caingot.png";
import raumuong from "../src/assets/raumuong.png";
import {
  FaMicrochip,
  FaNetworkWired,
  FaRobot,
  FaMobileAlt,
} from "react-icons/fa";

import client1 from "../src/assets/client1.png";
import client2 from "../src/assets/client2.png";
import client3 from "../src/assets/client3.png";

export const allservices = [
  {
    icon: xalach,
    title: "Xà Lách",
    about:
      "Sample text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "$2.99", // Add prices
  },
  {
    icon: caingot,
    title: "Cải Ngọt",
    about:
      "Sample text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "$3.49", // Add prices
  },
  {
    icon: raumuong,
    title: "Rau Muống",
    about:
      "Sample text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "$2.79", // Add prices
  },
];

export const planning = [
  {
    icon: FaMicrochip,
    title: "SENSOR SYSTEM SETUP",
    about:
      "Deploy environmental sensors (temperature, humidity, light, soil pH, etc.) across the farm. Gather real-time data for analysis and optimal decision-making.",
  },
  {
    icon: FaNetworkWired,
    title: "DATA CONNECTION & PROCESSING",
    about:
      "Transmit sensor data to a cloud platform. Use algorithms and AI to analyze data, identify trends, and predict potential issues.",
  },
  {
    icon: FaRobot,
    title: "FARMING PROCESS AUTOMATION",
    about:
      "Automatically adjust devices like irrigation, lighting, ventilation, and fertilization systems based on analyzed data to optimize crop growth.",
  },
  {
    icon: FaMobileAlt,
    title: "REMOTE MONITORING & ADJUSTMENT",
    about:
      "Farmers can monitor all farm activities and adjust parameters remotely via a smartphone or computer application, ensuring optimal conditions.",
  },
];

export const clients = [
  {
    image: client1,
    name: "Nguyễn Văn Nam",
    about: "The pricing was competitive, and the value proposition was clear.",
    post: "Customer",
  },
  {
    image: client2,
    name: "Trần Văn Việt",
    about:
      "I love that I can trace the origin of the products. It gives me confidence in their quality.",
    post: "Customer",
  },
  {
    image: client3,
    name: "Lê Văn Bình",
    about: "The produce I received was fresh and of excellent quality.",
    post: "Customer",
  },
];
