import React, { useState, useContext } from "react";
import { FaXmark, FaBars } from "react-icons/fa6"; // Import from react-icons/fa6
import {
  FaUser,
  FaShoppingCart,
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Added for dropdown
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false); // Close dropdown when mobile menu closes
  };

  const handleHomeClick = () => {
    navigate("/");
    window.location.reload();
  };

  const handleLogout = () => {
    logout(); // Call the logout function from the context
    navigate("/");
    setIsDropdownOpen(false); // Close dropdown on logout
  };

  const navItem = [
    { link: "Home", path: "/" },
    { link: "About", path: "/read-more" },
    { link: "Products", path: "/products" },
  ];

  return (
    <nav className="w-full flex bg-white justify-between items-center gap-1 lg:px-16 px-6 py-4 sticky top-0 z-50">
      <h1
        className="text-black md:text-6xl text-5xl font-bold font-rubik cursor-pointer"
        onClick={handleHomeClick}
      >
        IoT <span className="text-green-500 italic">Farm</span>
      </h1>
      <ul className="flex justify-center items-center gap-6">
        {navItem.map(({ link, path }) => (
          <Link
            key={path}
            to={path}
            className="text-black uppercase font-bold cursor-pointer p-3 rounded-full hover:bg-green-500 hover:text-black text-[15px]"
          >
            {link}
          </Link>
        ))}
      </ul>
      <div className="md:flex hidden items-center gap-4">
        {user ? (
          <>
            {/* Shopping Cart (Always Visible) */}
            {/* <Link
              to="/cart"
              className="relative p-3 group transition-all duration-300"
            >
              <FaShoppingCart className="w-5 h-5 text-black group-hover:text-green-500" /> */}
            {/* Optional cart item count */}
            {/* <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          3
        </span> */}
            {/* </Link> */}

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-green-500 hover:bg-black text-black hover:text-white px-6 py-2 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg min-w-[120px] justify-center"
              >
                <FaUser className="text-sm" />
                <span className="truncate max-w-[100px]">{user.fullname}</span>
                <span
                  className={`transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-50 border border-gray-200 overflow-hidden">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-gray-800 hover:bg-green-500 hover:text-white transition-colors duration-200 font-semibold"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaUserCircle className="mr-2" /> Profile
                  </Link>
                  <Link
                    to="/cart"
                    className="flex items-center px-4 py-3 text-gray-800 hover:bg-green-500 hover:text-white transition-colors duration-200 font-semibold"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaShoppingCart className="mr-2" /> Cart
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-3 text-gray-800 hover:bg-black hover:text-white transition-colors duration-200 font-semibold border-t border-gray-200"
                  >
                    <FaSignOutAlt className="mr-2" /> Log Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-green-500 hover:bg-black hover:text-white text-black px-8 py-2 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <FaSignInAlt /> LOG IN
            </Link>
            <Link
              to="/signup"
              className="bg-black hover:bg-green-500 hover:text-black text-white px-8 py-2 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <FaUserPlus /> SIGN UP
            </Link>
          </>
        )}
      </div>

      <div
        className="flex justify-center items-center lg:hidden mt-3"
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <FaXmark className="text-green-500 text-3xl cursor-pointer" />
        ) : (
          <FaBars className="text-green-500 text-3xl cursor-pointer" />
        )}
      </div>
      <div
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } w-full h-fit bg-green-500 p-4 absolute top-[72px] left-0`}
        onClick={closeMenu}
      >
        <ul className="flex flex-col justify-center items-center gap-2 w-full">
          {navItem.map(({ link, path }) => (
            <Link
              key={path}
              to={path}
              className="text-black uppercase font-semibold cursor-pointer p-2 rounded-lg hover:bg-black hover:text-white w-full text-center"
            >
              {link}
            </Link>
          ))}
          {user ? (
            <div className="w-full">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-black uppercase font-semibold cursor-pointer p-2 rounded-lg hover:bg-black hover:text-white w-full text-center"
              >
                <FaUser /> {user.name} ▼
              </button>
              {isDropdownOpen && (
                <>
                  <Link
                    to="/profile"
                    className="text-black uppercase font-semibold cursor-pointer p-2 rounded-lg hover:bg-black hover:text-white w-full text-center"
                  >
                    PROFILE
                  </Link>
                  <Link
                    to="/cart"
                    className="text-black uppercase font-semibold cursor-pointer p-2 rounded-lg hover:bg-black hover:text-white w-full text-center"
                  >
                    <FaShoppingCart /> CART
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-black uppercase font-semibold cursor-pointer p-2 rounded-lg hover:bg-black hover:text-white w-full text-center"
                  >
                    LOG OUT
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-black uppercase font-semibold cursor-pointer p-2 rounded-lg hover:bg-black hover:text-white w-full text-center"
              >
                LOG IN
              </Link>
              <Link
                to="/signup"
                className="text-black uppercase font-semibold cursor-pointer p-2 rounded-lg hover:bg-black hover:text-white w-full text-center"
              >
                SIGN UP
              </Link>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
