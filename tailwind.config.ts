import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          50: "#fff5f2",
          100: "#ffe6e1",
          200: "#ffc7ba",
          300: "#ff9f8c",
          400: "#ff7a61",
          500: "#ff4d2e",
          600: "#ff2600",
          700: "#cc1e00",
          800: "#991700",
          900: "#661000",
        },
      },
    },
  },
  plugins: [],
};

export default config; 