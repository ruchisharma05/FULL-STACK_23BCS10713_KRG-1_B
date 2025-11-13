import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "footergray": "#b8b8b8",
        "silver":"#d4d4d4",
        "footerblack":"#4a4a4a",
        "salmon":"#f8b4d9",
        "sandyBrown": "#f5e6a3",
        "bittersweet": "#ffb3ba",
        "oceanGreen": "#a8e6cf",
        "davysilver":"#a8a8a8",
        "cultured": "#f7f7f7",
        "white": "#ffffff",
        "onyx": "#404040",
        "eblack":"#4a4a4a",
        "blueIn":"rgb(173, 216, 230)",
        "blueAc":"rgb(135, 206, 250)",
        "btnpurple":"rgb(221, 160, 221)",
        primary: {"50":"#f0f9ff","100":"#e0f2fe","200":"#bae6fd","300":"#7dd3fc","400":"#38bdf8","500":"#0ea5e9","600":"#0284c7","700":"#0369a1","800":"#075985","900":"#0c4a6e","950":"#082f49"},
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      dropShadow: {
        'custom-xl': '0 0 5px rgba(0, 0, 0, 0.25)', // Example values, adjust as needed
      },
      fontFamily: {
      'body': [
      'Inter', 
      'ui-sans-serif', 
      'system-ui', 
      '-apple-system', 
      'system-ui', 
      'Segoe UI', 
      'Roboto', 
      'Helvetica Neue', 
      'Arial', 
      'Noto Sans', 
      'sans-serif', 
      'Apple Color Emoji', 
      'Segoe UI Emoji', 
      'Segoe UI Symbol', 
      'Noto Color Emoji'
    ],
        'sans': [
      'Inter', 
      'ui-sans-serif', 
      'system-ui', 
      '-apple-system', 
      'system-ui', 
      'Segoe UI', 
      'Roboto', 
      'Helvetica Neue', 
      'Arial', 
      'Noto Sans', 
      'sans-serif', 
      'Apple Color Emoji', 
      'Segoe UI Emoji', 
      'Segoe UI Symbol', 
      'Noto Color Emoji'
    ]
      }
    },
  },
  darkMode: "class",
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
  
};
export default config;
