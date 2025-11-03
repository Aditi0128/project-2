import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

export default function MenuDisplay() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔥 Fetch menu from Firestore
  useEffect(() => {
    const fetchMenu = async () => {
      const snapshot = await getDocs(collection(db, "menuItems"));
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMenuItems(items);
    };
    fetchMenu();
  }, []);

  // 🌈 Get all categories dynamically
  const allCategories = [
    "All",
    ...new Set(menuItems.map((item) => item.category || "Uncategorized")),
  ];

  // 🔍 Filter and group items
  const filteredItems = menuItems.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedBySubcategory = filteredItems.reduce((acc, item) => {
    const sub = item.subcategory || "General";
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(item);
    return acc;
  }, {});

  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-100 p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.h1
          className="text-4xl font-bold text-rose-700 mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Explore Our Menu
        </motion.h1>
        <p className="text-gray-600 text-lg">
          Discover our delicious dishes — hand-picked for every taste.
        </p>
      </div>

      {/* Category Bar */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md shadow-sm py-3 mb-6 flex flex-wrap justify-center gap-3 rounded-lg">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              selectedCategory === cat
                ? "bg-rose-600 text-white shadow-lg"
                : "bg-rose-100 text-rose-700 hover:bg-rose-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search for a dish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-5 py-3 rounded-full w-full sm:w-96 shadow focus:ring-2 focus:ring-rose-400 outline-none"
        />
      </div>

      {/* Menu Display */}
      <AnimatePresence>
        {Object.keys(groupedBySubcategory).length === 0 ? (
          <motion.p
            className="text-center text-gray-500 italic mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No menu items found.
          </motion.p>
        ) : (
          Object.entries(groupedBySubcategory).map(([subcategory, items]) => (
            <motion.div
              key={subcategory}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-10"
            >
              <h2 className="text-2xl font-semibold text-rose-700 mb-4 border-b border-rose-200 pb-2">
                {subcategory}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition border border-rose-100"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 mt-1">₹{item.price}</p>
                    <p className="text-sm text-gray-400 mt-1 italic">
                      {item.category}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </section>
  );
}
