import React from "react";
import {
  FaArrowUp,
  FaCopyright,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa6";
import { Link } from "react-scroll";

const Footer = () => {
  return (
    <>
      <div className="bg-black text-white p-10 grid lg:grid-cols-3 grid-cols-1 gap-8 text-center">
        {/* About Section */}
        <div>
          <h2 className="text-xl font-semibold mb-3">About IoT Farm</h2>
          <p className="text-sm">
            IoT Farm leverages smart technology to optimize agricultural
            processes, increase efficiency, and support sustainable farming.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <a href="/read-more" className="hover:text-green-400">
                About Us
              </a>
            </li>

            <li>
              <a href="/policy" className="hover:text-green-400">
                Privacy & Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Social Media */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
          <p className="text-sm">Email: support@iotfarm.com</p>
          <p className="text-sm">Phone: +1 234 567 890</p>
          <div className="flex justify-center gap-4 mt-3">
            <a href="#" className="hover:text-green-400">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="hover:text-green-400">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="hover:text-green-400">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-green-400">
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-black text-white flex justify-center items-center gap-2 p-5 border-t border-gray-700 text-center">
        <FaCopyright className="fill-green-500 lg:size-5 size-8" />
        <p className="text-lg">Copyright 2025, IoT Farm, All Rights Reserved</p>
      </div>

      {/* Scroll to Top Button */}
      <div
        id="icon-box"
        className="bg-green-500 text-black p-3 rounded-full hover:bg-black hover:text-white cursor-pointer fixed lg:bottom-6 right-6 bottom-6"
      >
        <Link to="hero" spy={true} offset={-100} smooth={true}>
          <FaArrowUp className="size-6" />
        </Link>
      </div>
    </>
  );
};

export default Footer;
