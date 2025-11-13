module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7c3aed",
        "primary-foreground": "#fff",
        destructive: "#dc2626",
        border: "rgba(0,0,0,0.1)",
        input: "rgba(0,0,0,0.1)",
        "muted-foreground": "rgba(0,0,0,0.4)",
        background: "#f9fafb",
        foreground: "#111827",
      },
      boxShadow: {
        elegant: "0 10px 15px -3px rgba(124, 58, 237, 0.3), 0 4px 6px -2px rgba(124, 58, 237, 0.1)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};