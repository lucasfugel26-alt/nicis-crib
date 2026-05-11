/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: "#fbf4e7",
        linen: "#f3e5d1",
        oat: "#dcc7a5",
        cocoa: "#5f4a3f",
        sage: "#9daf8c",
        moss: "#6f8560",
        rose: "#e8b8ad",
        clay: "#c98572",
        butter: "#f1d88d",
        skysoft: "#b9d6d3"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(95, 74, 63, 0.13)",
        glow: "0 16px 40px rgba(157, 175, 140, 0.25)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
