import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Link } from "react-router-dom";

import {
  FaStar,
  FaUtensils,
  FaLeaf,
  FaSmile,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaGoogle,
} from "react-icons/fa";

const dishes = [
  {
    id: 1,
    name: "Starter Platter",
    tag: "Indian Classic",
    price: 280,
    img: "/images/image1.webp",
  },
  {
    id: 2,
    name: "Veg Hakka Noodles",
    tag: "Chinese Street Favorite",
    price: 160,
    img: "/images/HakkaNoodles3.webp",
  },
  {
    id: 3,
    name: "Thali",
    tag: "Authentic Marathi Feast",
    price: 80,
    img: "/images/16.jpg",
  },
  {
    id: 4,
    name: "Tandoori Chicken",
    tag: "Tandoori Delight",
    price: 200,
    img: "/images/3.jpg",
  },
  {
    id: 5,
    name: "Malai Tandoor",
    tag: "Non-Veg Favorite",
    price: 180,
    img: "/images/13.jpg",
  },
];

export default function Home() {
  return (
    <div className="w-screen min-h-screen font-body text-gray-800 bg-gradient-to-b from-amber-50 via-cream-light to-white overflow-x-hidden overflow-y-auto">
      {/* HERO SECTION */}
      <section className="relative w-screen h-screen bg-[url('/src/assets/bg2.jpg')] bg-cover bg-center bg-no-repeat overflow-hidden">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 sm:px-12">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-heading text-white drop-shadow-lg"
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
              Hotel Rajsik
            </span>
          </motion.h1>

          <TypeAnimation
            sequence={[
              "Where Flavor Meets Elegance 🍽️",
              1500,
              "Savor Indian & Chinese Cuisine 🥢",
              1500,
              "Crafted with Love, Served with Warmth ❤️",
              1500,
            ]}
            wrapper="span"
            repeat={Infinity}
            className="mt-4 text-lg sm:text-xl text-amber-200 font-medium tracking-wide"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row gap-5"
          >
            <a
              href="#menu"
              className="px-8 py-3 bg-gradient-to-r from-amber-300 to-yellow-500 text-gray-900 font-semibold rounded-full shadow-lg hover:scale-105 hover:shadow-amber-300/60 transition"
            >
              View Menu
            </a>
            <a
              href="#reserve"
              className="px-8 py-3 border-2 border-amber-300 text-white rounded-full hover:bg-amber-300/20 transition"
            >
              Reserve a Table
            </a>
          </motion.div>
        </div>

        <div className="absolute bottom-10 w-full flex justify-center text-amber-200 text-lg animate-bounce">
          ↓ Scroll for More
        </div>
      </section>

      {/* POPULAR DISHES */}
      <motion.section
        id="menu"
        className="w-full py-24 bg-gradient-to-b from-white to-amber-50"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-heading text-center mb-12 text-gray-900">
            Popular Dishes
          </h2>

          <div className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-4">
            {dishes.map((d) => (
              <motion.div
                key={d.id}
                whileHover={{ scale: 1.05 }}
                className="min-w-[260px] sm:min-w-[300px] snap-center rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 flex-shrink-0 border border-amber-100"
              >
                <div className="relative">
                  <img
                    src={d.img}
                    alt={d.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition flex items-center justify-center text-amber-300 text-xl font-semibold">
                    ₹{d.price}
                  </div>
                </div>
                <div className="p-6 text-center bg-gradient-to-t from-white to-amber-50">
                  <h3 className="text-2xl font-heading text-gray-900 mb-1">
                    {d.name}
                  </h3>
                  <p className="text-gray-600 italic">{d.tag}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* RESERVATION SECTION */}
      <motion.section
        id="reserve"
        className="py-24 bg-gradient-to-r from-amber-50 to-yellow-100"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center bg-white/80 backdrop-blur-md py-16 rounded-3xl shadow-xl border border-amber-200">
          <h2 className="text-4xl font-heading mb-6 text-gray-900">
            Reserve a Table
          </h2>
          <p className="text-gray-700 mb-6 text-lg">
            Book your table in advance and enjoy a seamless dining experience.
          </p>

          <img
            src="/images/hotelimg.webp"
            alt="Reservation"
            className="mx-auto mb-6 rounded-2xl shadow-lg w-full max-w-sm"
          />

          <p className="text-gray-700 text-lg">
            Please{" "}
            <Link
              to="/booking"
              className="text-amber-700 font-semibold hover:underline cursor-pointer"
            >
              click here
            </Link>{" "}
            and log in to do so!
          </p>
        </div>
      </motion.section>

      {/* REVIEWS */}
      <motion.section
        className="py-24 bg-gradient-to-b from-amber-50 to-amber-100"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-heading mb-10 text-gray-900">
            What Our Guests Say
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {[1, 2, 3].map((r) => (
              <motion.div
                key={r}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-2xl shadow-lg w-80 text-left border border-amber-100"
              >
                <div className="flex items-center mb-3 text-yellow-400 text-lg">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">
                  “Amazing food, great ambiance and quick service. Definitely
                  coming again!”
                </p>
                <p className="font-semibold text-gray-900">— Google Reviewer</p>
              </motion.div>
            ))}
          </div>

          <a
            href="https://www.google.com/maps/place/Hotel+Rajshik"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-10 text-amber-700 hover:text-amber-800 font-medium transition"
          >
            <FaGoogle /> View More Reviews
          </a>
        </div>
      </motion.section>

      {/* CONTACT */}
      <motion.section
        className="py-24 bg-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-heading mb-8 text-gray-900">Visit Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5 text-gray-700 text-lg">
              <p className="flex justify-center items-center gap-3">
                <FaMapMarkerAlt className="text-amber-400 text-2xl" />
                Kapsal, Chiplun, Maharashtra, India
              </p>
              <p className="flex justify-center items-center gap-3">
                <FaPhoneAlt className="text-amber-400 text-2xl" /> +91 98765
                43210
              </p>
              <p className="flex justify-center items-center gap-3">
                <FaEnvelope className="text-amber-400 text-2xl" />{" "}
                contact@hotelrajsik.com
              </p>
              <div className="mt-6">
                <a
                  href="https://maps.app.goo.gl/2QMY8tiJthbik6n57"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-amber-300 to-yellow-500 text-gray-900 rounded-full shadow-md hover:scale-105 transition"
                >
                  Get Directions
                </a>
              </div>
            </div>

            <iframe
              title="Rajsik Location"
              src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d121768.26397770019!2d73.42382793999582!3d17.495181410615555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x3bc2070011e9a17f%3A0x29ad0d1d51b40e36!2sFGW4%2B3FH%2C%20Kapsal%2C%20Chiplun%2C%20Maharashtra%20415605!3m2!1d17.4951994!2d73.50622969999999!5e0!3m2!1sen!2sin!4v1762173150031!5m2!1sen!2sin"
              width="100%"
              height="350"
              allowFullScreen=""
              loading="lazy"
              className="rounded-2xl shadow-xl border border-amber-100"
            ></iframe>
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-12 w-full">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <p className="text-gray-400">
            © 2025 Hotel Rajsik • Crafted with ❤️ for food lovers
          </p>
          <div className="flex justify-center gap-8 text-xl">
            <a href="#" className="hover:text-amber-400 transition">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/hotel_rajsik?igsh=YnBxc2N4Zml6aGkx" className="hover:text-amber-400 transition">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-amber-400 transition">
              <FaTwitter />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

