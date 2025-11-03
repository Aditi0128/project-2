import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { auth } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-premium sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-heading text-primary tracking-wide hover:text-gold transition"
        >
          Hotel Rajsik
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 font-body text-gray-700 text-lg items-center">
          <Link to="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <Link to="/menu" className="hover:text-gold transition-colors">
            Menu
          </Link>
          <Link to="/booking" className="hover:text-gold transition-colors">
            Book Table
          </Link>
          <Link to="/admin" className="hover:text-gold transition-colors">
            Admin
          </Link>
          <Link to="/gallery" className="hover:text-gold transition-colors">
            Food Gallery
          </Link>

          {user ? (
            <>
              <span className="px-3 py-1 text-sm rounded-full bg-gray-100 border text-gray-700">
                {user.email === "admin@example.com" ? "Admin" : "User"}
              </span>
              <button
                onClick={handleLogout}
                className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="border border-orange-500 text-orange-500 px-4 py-1 rounded hover:bg-orange-500 hover:text-white transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-primary"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-white shadow-inner border-t border-gray-200">
          <div className="flex flex-col px-6 py-4 space-y-3 font-body text-gray-700 text-lg">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="hover:text-gold transition-colors"
            >
              Home
            </Link>
            <Link
              to="/menu"
              onClick={() => setOpen(false)}
              className="hover:text-gold transition-colors"
            >
              Menu
            </Link>
            <Link
              to="/booking"
              onClick={() => setOpen(false)}
              className="hover:text-gold transition-colors"
            >
              Book Table
            </Link>
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="hover:text-gold transition-colors"
            >
              Admin
            </Link>

            {user ? (
              <>
                <span className="px-3 py-1 text-sm rounded-full bg-gray-100 border text-gray-700">
                  {user.email === "admin@example.com" ? "Admin" : "User"}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="border border-orange-500 text-orange-500 px-4 py-1 rounded hover:bg-orange-500 hover:text-white transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
