/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          sand: "#f6efe4",
          "sand-strong": "#ebdecd",
          clay: "#b2502d",
          "clay-strong": "#8c3c20",
          ink: "#182328",
          "ink-soft": "#49565d",
          mint: "#0f766e",
          gold: "#e6b94c",
          card: "#fffaf3",
          border: "#e7d7c3",
          danger: "#b42318",
          success: "#166534"
        }
      },
      fontFamily: {
        sans: ["System"],
        rounded: ["System"]
      }
    }
  }
};
