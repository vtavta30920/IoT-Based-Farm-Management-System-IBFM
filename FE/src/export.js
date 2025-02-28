import building from "../src/assets/building.svg";
import construction from "../src/assets/construction.svg";
import design from "../src/assets/design.svg";
import document from "../src/assets/document.svg";
import paint from "../src/assets/paint.svg";
import support from "../src/assets/support.svg";

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
    icon: building,
    title: "BUILDING RENOVATION",
    about:
      "Sample text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    icon: construction,
    title: "CONSTRUCTION SERVICES",
    about:
      "Sample text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    icon: design,
    title: "DESIGN & PLANNING",
    about:
      "Sample text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    icon: document,
    title: "DOCUMENTATION",
    about:
      "Sample text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    icon: paint,
    title: "INTERIOR DESIGN",
    about:
      "Sample text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    icon: support,
    title: "CUSTOMER SUPPORT",
    about:
      "Sample text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
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
    about:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas gravida cursus",
    post: "Farmer",
  },
  {
    image: client2,
    name: "Trần Văn Việt",
    about:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas gravida cursus",
    post: "Farmer",
  },
  {
    image: client3,
    name: "Lê Văn Bình",
    about:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas gravida cursus",
    post: "Farmer",
  },
];
