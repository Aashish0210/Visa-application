/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // ── Pathfinder Nepal brand palette ──
        nepal: {
          navy: "#1B2B4B",   // dark mountain navy (primary brand)
          gold: "#D4A017",   // golden peak / "PATHFINDER" text
          "gold-light": "#F0C040", // lighter gold for hover states
          blue: "#1E4CB8",   // "NEPAL" text blue
          "blue-light": "#2563EB", // bright accent blue
          silver: "#9AAABB",   // "VISA SOLUTIONS" silver text
          snow: "#E8F0F7",   // snowy peaks / light backgrounds
          crimson: "#DC143C",   // kept for Nepal flag accent
          offwhite: "#F7F8FA",
        },
      },
      fontFamily: {
        outfit: ["var(--font-outfit)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        'lg': '0.5rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
