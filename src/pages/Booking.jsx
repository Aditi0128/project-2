// src/pages/Booking.jsx
import BookingForm from "../components/BookingForm";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ Redirect only after mount
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null; // Prevent render while redirecting

  return (
    <section
      className="min-h-screen px-6 sm:px-12 py-16 
      bg-gradient-to-br from-pink-50 via-cream-light to-mint-50
      flex items-center justify-center"
    >
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left flex flex-col items-start"
        >
          <img
            src="images/bg3.jpg"
            alt="Book a Table"
            className="w-full max-w-sm rounded-2xl shadow-lg mb-6"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading text-maroon leading-tight">
            Book a Table
          </h1>
          <p className="mt-4 text-brown-700 text-base sm:text-lg max-w-md">
            Request a reservation and we'll confirm it from the admin panel.
          </p>
        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-lg mx-auto lg:mx-0"
        >
          <BookingForm />
        </motion.div>
      </div>
    </section>
  );
}
