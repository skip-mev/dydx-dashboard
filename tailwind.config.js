// @ts-check

const defaultTheme = require("tailwindcss/defaultTheme");

/**
 * @type {import("tailwindcss").Config}
 * @see https://tailwindcss.com/docs/theme
 */
const tailwindConfig = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "fade-right": "fade-right 2s both infinite",
      },
      colors: {
        light: {
          30: "#F3F6F808",
          50: "#F3F6F80D",
          100: "#F3F6F81A",
          200: "#F3F6F833",
          300: "#F3F6F84D",
          400: "#F3F6F866",
          500: "#F3F6F880",
          600: "#F3F6F899",
          700: "#F3F6F8B2",
          800: "#F3F6F8CC",
          900: "#F3F6F8E5",
          950: "#F3F6F8F2",
          DEFAULT: "#F3F6F8",
        },
      },
      fontFamily: {
        mono: ["Inconsolata", ...defaultTheme.fontFamily.mono],
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        "fade-right": {
          from: { opacity: "0", transform: "translate(-100%)" },
          to: { opacity: "1", transform: "translate(100%)" },
        },
      },
    },
  },
  plugins: [
    //
  ],
};

module.exports = tailwindConfig;
