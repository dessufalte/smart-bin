/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          900: "#021a07",
          800: "#052e0f",
          700: "#0a4a1a",
          600: "#0f6627",
          500: "#15803d",
          400: "#22c55e",
          300: "#86efac",
          200: "#bbf7d0",
          100: "#dcfce7",
          50:  "#f0fdf4",
        },
        glass: {
          white: "rgba(255,255,255,0.07)",
          border: "rgba(255,255,255,0.12)",
          hover: "rgba(255,255,255,0.11)",
        },
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
        "leaf": "leaf 8s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        leaf: {
          "0%, 100%": { transform: "rotate(-5deg) translateY(0)" },
          "50%": { transform: "rotate(5deg) translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
