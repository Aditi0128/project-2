module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7f1d1d", // Deep red, luxurious
        gold: "#facc15", // Gold accent
        cream: "#fefce8", // Soft background
        maroon: "#800000", // Added maroon
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"], // Elegant serif
        body: ["Inter", "sans-serif"], // Clean body text
      },
      boxShadow: {        premium: "0 8px 30px rgba(0,0,0,0.15)", // Softer premium shadows
      },
    },
  },
  plugins: [],
};
