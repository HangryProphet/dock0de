module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F7F7F5",
        surface: "#FFFFFF",
        "surface-alt": "#F2F2EE",
        border: "#E5E5E0",
        text: "#111111",
        "text-secondary": "#5E5E5E",
        "text-muted": "#8A8A8A",
        accent: "#2E3A8C",
      },
      fontFamily: {
        sans: ["Manrope", "Sora", "Noto Sans", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
        input: "12px",
      },
    },
  },
  plugins: [],
};
