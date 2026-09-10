/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#0D0D0D",
        card: "#141414",
        "card-hover": "#1A1A1A",
        border: "#242424",
        conversion: {
          orange: "#FF5B00",
          "orange-hover": "#E64D00",
          green: "#10B981",
          "green-hover": "#059669",
          red: "#EF4444",
        },
      },
      animation: {
        "pulse-fast": "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 10px rgba(255, 91, 0, 0.2)" },
          "100%": { boxShadow: "0 0 25px rgba(255, 91, 0, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};
