import React, { useState, useContext } from "react";
import { FaXmark, FaBars } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext"; // Import the UserContext

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext); // Access user and logout function

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigate("/");
    window.location.reload(); // Ensures full page reload
  };

  const handleLogout = () => {
    logout(); // Call the logout function
    navigate("/"); // Redirect to the home page
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
          <>
            <Link
              to="/profile"
              className="bg-green-500 hover:bg-black hover:text-white text-black px-10 py-3 rounded-full font-semibold transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              PROFILE
            </Link>
            <button
              onClick={handleLogout}
              className="bg-black hover:bg-green-500 hover:text-black text-white px-10 py-3 rounded-full font-semibold transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              LOG OUT
            </button>
          </>
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

      {/* Mobile Menu */}
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
            <>
              <Link
                to="/profile"
                className="text-black uppercase font-semibold cursor-pointer p-2 rounded-lg hover:bg-black hover:text-white w-full text-center"
              >
                PROFILE
              </Link>
              <button
                onClick={handleLogout}
                className="text-black uppercase font-semibold cursor-pointer p-2 rounded-lg hover:bg-black hover:text-white w-full text-center"
              >
                LOG OUT
              </button>
            </>
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