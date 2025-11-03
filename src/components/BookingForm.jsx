// src/components/BookingForm.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { db, auth } from "../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function BookingForm({ onBookingSuccess }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: 1,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in before booking a table.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "bookings"), {
        ...formData,
        userId: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
        status: "pending",
      });

      alert("Booking submitted successfully!");
      setFormData({ name: "", phone: "", date: "", time: "", guests: 1 });
      if (onBookingSuccess) onBookingSuccess();
    } catch (err) {
      console.error("Error adding booking:", err);
      alert("Failed to submit booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onSubmit={handleSubmit}
      className="bg-gradient-to-b from-rose-50 via-amber-50 to-rose-100 
                 shadow-2xl rounded-3xl p-8 sm:p-10 lg:p-12 
                 space-y-6 max-w-xl mx-auto border border-rose-100"
    >
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-rose-900 drop-shadow-sm">
          Reserve a Table
        </h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Fill in your details and we’ll confirm shortly.
        </p>
      </div>

      {["name", "phone", "date", "time", "guests"].map((field) => (
        <div key={field}>
          <label className="block text-sm font-semibold text-gray-800 mb-1 capitalize">
            {field}
          </label>
          <input
            type={
              field === "date"
                ? "date"
                : field === "time"
                ? "time"
                : field === "guests"
                ? "number"
                : "text"
            }
            name={field}
            value={formData[field]}
            onChange={handleChange}
            required
            min={field === "guests" ? 1 : undefined}
            placeholder={
              field === "name"
                ? "John Doe"
                : field === "phone"
                ? "+91 98765 43210"
                : ""
            }
            className="mt-1 w-full border border-amber-300 bg-white rounded-xl px-4 py-3 
                     focus:ring-2 focus:ring-rose-400 focus:border-rose-400 
                     shadow-sm transition"
          />
        </div>
      ))}

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-rose-600 to-rose-800 
                   text-white py-3 sm:py-4 rounded-xl font-semibold text-lg 
                   shadow-md hover:shadow-xl transition disabled:opacity-70"
      >
        {loading ? "Submitting..." : "Submit Booking"}
      </motion.button>
    </motion.form>
  );
}
