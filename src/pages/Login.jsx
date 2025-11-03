import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2️⃣ Check Firestore for admin role
      const adminRef = doc(db, "admin", user.email);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists() && adminSnap.data().role === "admin") {
        alert("Welcome, Admin!");
        navigate("/admin");
      } else {
        alert("Login successful!");
        navigate("/booking");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-rose-100 to-pink-200 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-rose-700">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Login to manage your bookings at{" "}
          <span className="font-semibold text-rose-600">Hotel Rajshik</span>
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition-all placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition-all placeholder-gray-400"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            type="submit"
            className="w-full bg-gradient-to-r from-rose-500 to-amber-400 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-rose-600 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
