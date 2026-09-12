/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-strong": "var(--surface-strong)",
        content: "var(--content)",
        "content-muted": "var(--content-muted)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        border: "var(--border)",
        shadow: "var(--shadow)",
        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#DC2626",
      },
      fontSize: {
        body: ["16px", { lineHeight: "24px", fontWeight: "500" }],
        "body-muted": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        title: ["34px", { lineHeight: "38px", fontWeight: "700", letterSpacing: "-0.6px" }],
        subtitle: ["16px", { lineHeight: "24px", fontWeight: "500" }],
        eyebrow: ["12px", { lineHeight: "16px", fontWeight: "700", letterSpacing: "1.4px" }],
        "section-title": ["20px", { lineHeight: "26px", fontWeight: "700", letterSpacing: "-0.2px" }],
        "button-label": ["16px", { lineHeight: "22px", fontWeight: "700" }],
        "metric-value": ["28px", { lineHeight: "32px", fontWeight: "800", letterSpacing: "-0.4px" }],
        chip: ["12px", { lineHeight: "16px", fontWeight: "700", letterSpacing: "0.4px" }],
      },
    },
  },
  plugins: [],
};