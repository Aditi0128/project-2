import React from "react";
import { motion } from "framer-motion";

export default function FoodGallery() {
  const images = [
    "1.webp",
    "2.jpg",
    "2.webp",
    "3.jpg",
    "4.jpg",
    "5.jpg",
    "6.jpg",
    "7.jpg",
    "8.jpg",
    "9.jpg",
    "10.jpg",
    "11.jpg",
    "12.jpg",
    "13.jpg",
    "14.jpg",
    "15.jpg",
    "16.jpg",
    "17.jpg",
    "18.jpg",
    "19.jpg",
    "20.jpg",
    "image1.webp",
    "image2.webp",
  ];

  // Random heights for variety
  const heights = ["h-40", "h-52", "h-64", "h-80"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 p-6 sm:p-10">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
        🍽️ Food Gallery
      </h1>

      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
        {images.map((file, index) => {
          const imagePath = `/images/${file}`;
          const randomHeight = heights[index % heights.length];

          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 break-inside-avoid"
            >
              <img
                src={imagePath}
                alt=""
                loading="lazy"
                className={`w-full object-cover ${randomHeight}`}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
