// @ts-check

const { fontFamily } = require("tailwindcss/defaultTheme");

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
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-right": "fade-right 2s both infinite",
      },
      colors: {
        dydx: {
          alert: "#FF486E",
          bg: "#151617",
        },
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
        mono: ["Inconsolata Variable", "Inconsolata", ...fontFamily.mono],
        sans: ["Inter Variable", "Inter", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-right": {
          from: { opacity: "0", transform: "translate(-100%)" },
          to: { opacity: "1", transform: "translate(100%)" },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    //
  ],
};

module.exports = tailwindConfig;
