/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: ["text-left", "text-center", "text-right"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Inconsolata", "monospace"],
      },
      colors: {
        light: "#F3F6F8",
        "light-3": "#F3F6F808",
        "light-10": "#F3F6F81A",
        "light-40": "#F3F6F866",
        "light-50": "#F3F6F880",
        "light-60": "#F3F6F899",
        "light-70": "#F3F6F8B2",
        "light-95": "#F3F6F8F2",
      },
    },
  },
  plugins: [],
};
