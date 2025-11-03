// src/components/AdminBookings.jsx
import { useEffect, useState } from "react";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(
          "https://hotel-backend-fdtk.onrender.com/api/bookings"
        );
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <p className="text-gray-600">Loading bookings...</p>;

  return (
    <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200 mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-rose-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
              Guests
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {bookings.length > 0 ? (
            bookings.map((b, idx) => (
              <tr key={idx} className="hover:bg-rose-50 transition">
                <td className="px-6 py-4 text-sm text-gray-700">{b.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{b.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{b.date}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{b.time}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{b.guests}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                No bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
