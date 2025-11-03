import { useState } from "react";
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Allowed admin emails
  const ADMIN_EMAILS = ["admin@hotelrajshik.com", "owner@hotelrajshik.com"];

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const role = ADMIN_EMAILS.includes(email.toLowerCase())
        ? "admin"
        : "user";

      await setDoc(doc(db, "users", user.uid), {
        email,
        role,
        createdAt: new Date().toISOString(),
      });

      alert(`Registration successful as ${role}`);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-rose-100 to-pink-200 p-4">
      <form
        onSubmit={handleRegister}
        className="bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-5 transition-all"
      >
        <h2 className="text-3xl font-bold text-center text-rose-700 mb-4">
          Create an Account
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Register to manage your bookings at{" "}
          <span className="font-semibold text-rose-600">Hotel Rajshik</span>
        </p>

        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 p-3 rounded-xl outline-none transition-all placeholder-gray-400"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 p-3 rounded-xl outline-none transition-all placeholder-gray-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-rose-500 to-amber-400 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform duration-200"
        >
          Register
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-rose-600 font-semibold hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
