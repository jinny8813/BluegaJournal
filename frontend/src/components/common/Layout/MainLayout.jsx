import { Link, useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-950 shadow-lg">
        <div className="w-full pl-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold text-white">
              BluegaJournal
            </Link>

            {/* Navigation Links */}
            <div className="flex h-full">
              <Link
                to="/blog"
                className={`h-full flex items-center px-6 text-white ${
                  location.pathname === "/blog"
                    ? "bg-blue-400"
                    : "hover:bg-blue-500 transition-colors duration-200"
                }`}
              >
                部落格
              </Link>
              <Link
                to="/planner"
                className={`h-full flex items-center px-6 text-white ${
                  location.pathname === "/planner"
                    ? "bg-blue-400"
                    : "hover:bg-blue-500 transition-colors duration-200"
                }`}
              >
                電子手帳
              </Link>
              <Link
                to="/shop"
                className={`h-full flex items-center px-6 text-white ${
                  location.pathname === "/shop"
                    ? "bg-blue-400"
                    : "hover:bg-blue-500 transition-colors duration-200"
                }`}
              >
                商店
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        <div className="w-full h-full">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-950 text-white py-4">
        <div className="text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} BluegaJournal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
