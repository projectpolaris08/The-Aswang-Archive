/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["EB Garamond", "serif"],
      },
      colors: {
        gray: {
          50: "#F7F7F8",
          100: "#EAEAEC",
          200: "#CACACD",
          300: "#ADADB2",
          400: "#888891",
          500: "#6C6C74",
          600: "#55555C",
          700: "#3F3F44",
          800: "#27272A",
          900: "#18181B",
        },
        red: {
          50: "#FFF5F5",
          100: "#FFE3E3",
          200: "#FFC9C9",
          300: "#FFA8A8",
          400: "#FF8787",
          500: "#E53E3E",
          600: "#C53030",
          700: "#9B2C2C",
          800: "#822727",
          900: "#63171B",
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.300"),
            h1: {
              color: theme("colors.white"),
              fontFamily: theme("fontFamily.serif"),
            },
            h2: {
              color: theme("colors.white"),
              fontFamily: theme("fontFamily.serif"),
            },
            h3: {
              color: theme("colors.white"),
              fontFamily: theme("fontFamily.serif"),
            },
            a: {
              color: theme("colors.red.500"),
              "&:hover": {
                color: theme("colors.red.400"),
              },
            },
          },
        },
      }),
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        html: { fontSize: "16px" },
      });
    },
  ],
};
