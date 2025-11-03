// src/App.jsx
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./lib/firebase";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bill from "./pages/billGenerator";
import MenuDisplay from "./pages/Menu";
import AdminBilling from "./pages/AdminBilling";
import Bills from "./pages/Bills";
import BillHistory from "./pages/BillHistory";
import FoodGallery from "./pages/FoodGallery";

import { motion } from "framer-motion";

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // 🔍 Check if user exists in admin collection
        const adminRef = doc(db, "admin", currentUser.email);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists() && adminSnap.data().role === "admin") {
          setRole("admin");
        } else {
          setRole("user");
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    setRole(null);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full"
        ></motion.div>
        <motion.h1
          className="mt-6 text-3xl font-heading text-orange-600"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Hotel Rajsik
        </motion.h1>
        <p className="mt-2 text-gray-500 font-body">Authentic Taste Awaits...</p>
      </div>
    );

  return (
    <div className="w-screen min-h-screen bg-gray-50 overflow-x-hidden">
      {/* ✅ Full-width Navbar */}
      <Navbar user={user ? { ...user, role } : null} onLogout={handleLogout} />

      {/* ✅ Full-screen main section */}
      <main className="w-full min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menu" element={<MenuDisplay />} />
          <Route path="/gallery" element={<FoodGallery />} />

          {/* User routes */}
          <Route
            path="/booking"
            element={user ? <Booking /> : <Navigate to="/login" replace />}
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              user && role === "admin" ? (
                <Admin />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/admin/billing"
            element={
              user && role === "admin" ? (
                <AdminBilling />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/billHistory"
            element={
              user && role === "admin" ? (
                <BillHistory />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/bills" element={<Bills />} />
          <Route
            path="/billGenerator"
            element={
              user && role === "admin" ? (
                <Bill />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}
