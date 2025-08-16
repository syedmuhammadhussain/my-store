/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      animationDelay: {
        0: "0s",
        200: "0.2s",
        300: "0.3s",
        500: "0.5s",
        800: "0.8s",
        1100: "1.1s",
        1300: "1.4s",
      },
    },
  },
  plugins: [
    require("tailwindcss-motion"),
    function ({ addUtilities, theme, e }) {
      const delays = theme("animationDelay");
      const utilities = Object.entries(delays).map(([key, value]) => {
        return {
          [`.animate-delay-${key}`]: {
            animationDelay: value,
          },
        };
      });
      addUtilities(utilities, ["responsive"]);
    },
    // any plugins you need (e.g. forms, etc) – do NOT add @tailwindcss/postcss here
  ],
};
