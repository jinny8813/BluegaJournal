import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false); // 控制手機選單的開關

  return (
    <div className="w-full h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 w-full h-12 bg-blue-950 shadow-lg z-10 flex items-center">
        <div className="w-full h-full px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="font-bold text-white">
            BluegaJournal
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex h-full text-sm">
            <Link
              to="/planner"
              className={`h-full flex items-center px-4 text-white ${
                location.pathname === "/planner"
                  ? "bg-blue-400"
                  : "hover:bg-blue-500 transition-colors duration-200"
              }`}
            >
              電子手帳
            </Link>
            <Link
              to="/flashcard"
              className={`h-full flex items-center px-4 text-white ${
                location.pathname === "/flashcard"
                  ? "bg-blue-400"
                  : "hover:bg-blue-500 transition-colors duration-200"
              }`}
            >
              單字閃卡
            </Link>
            <Link
              to="/about"
              className={`h-full flex items-center px-4 text-white ${
                location.pathname === "/about"
                  ? "bg-blue-400"
                  : "hover:bg-blue-500 transition-colors duration-200"
              }`}
            >
              關於我
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="py-4 text-white focus:outline-none"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-12 left-0 w-full bg-blue-950 text-white flex flex-col text-sm">
            <Link
              to="/blog"
              className={`py-2 px-4 ${
                location.pathname === "/blog"
                  ? "bg-blue-400"
                  : "hover:bg-blue-500 transition-colors duration-200"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              部落格
            </Link>
            <Link
              to="/planner"
              className={`py-2 px-4 ${
                location.pathname === "/planner"
                  ? "bg-blue-400"
                  : "hover:bg-blue-500 transition-colors duration-200"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              電子手帳
            </Link>
            <Link
              to="/shop"
              className={`py-2 px-4 ${
                location.pathname === "/shop"
                  ? "bg-blue-400"
                  : "hover:bg-blue-500 transition-colors duration-200"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              商店
            </Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow w-full bg-gray-100">{children}</main>

      {/* Footer */}
      <footer className="sticky bottom-0 z-10 w-full h-12 bg-blue-950 text-white flex items-center justify-center">
        <p className="text-xs">
          © {new Date().getFullYear()} BluegaJournal. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default MainLayout;
