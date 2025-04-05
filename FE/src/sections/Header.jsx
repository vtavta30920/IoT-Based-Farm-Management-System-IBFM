import React, { useState, useContext } from "react";
import { FaXmark, FaBars } from "react-icons/fa6"; // Import from react-icons/fa6
import { FaUser, FaShoppingCart } from "react-icons/fa"; // Other icons from react-icons/fa
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

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
      <div className="md:flex hidden gap-3">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-green-500 hover:bg-black hover:text-white text-black px-10 py-3 rounded-full font-semibold transform hover:scale-105 transition-transform duration-300 cursor-pointer flex items-center gap-2"
            >
              <FaUser /> {user.name} ▼
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-black hover:bg-green-500 hover:text-white uppercase font-semibold"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/cart"
                  className="block px-4 py-2 text-black hover:bg-green-500 hover:text-white uppercase font-semibold"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FaShoppingCart /> Cart
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-black hover:bg-green-500 hover:text-white uppercase font-semibold"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-green-500 hover:bg-black hover:text-white text-black px-10 py-3 rounded-full font-semibold transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              LOG IN
            </Link>
            <Link
              to="/signup"
              className="bg-black hover:bg-green-500 hover:text-black text-white px-10 py-3 rounded-full font-semibold transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              SIGN UP
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