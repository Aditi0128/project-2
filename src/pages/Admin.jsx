import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBookings(data);
    });
    return unsubscribe;
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status: newStatus });
    } catch (err) {
      console.error("Error updating booking:", err);
    }
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.phone?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="p-8 bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold text-rose-700">Admin Panel</h1>
          <p className="text-gray-700">
            Manage bookings, confirm reservations, and handle billing.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/bills"
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
          >
            🧾 Bill Generator
          </Link>
          <Link
            to="/billHistory"
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            📜 Bill History
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
      </div>

      {/* Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-x-auto bg-white shadow-lg rounded-2xl"
      >
        <table className="w-full border-collapse">
          <thead className="bg-rose-600 text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Guests</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b) => (
              <tr key={b.id} className="border-b hover:bg-amber-50">
                <td className="p-3">{b.name}</td>
                <td className="p-3">{b.phone}</td>
                <td className="p-3">{b.date || "-"}</td>
                <td className="p-3">{b.time || "-"}</td>
                <td className="p-3">{b.guests || "-"}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      b.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : b.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  {b.status !== "confirmed" && (
                    <button
                      onClick={() => handleStatusChange(b.id, "confirmed")}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Confirm
                    </button>
                  )}
                  {b.status !== "completed" && (
                    <button
                      onClick={() => handleStatusChange(b.id, "completed")}
                      className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBookings.length === 0 && (
          <p className="text-center text-gray-600 py-8">
            No matching customers found.
          </p>
        )}
      </motion.div>
    </section>
  );
}
