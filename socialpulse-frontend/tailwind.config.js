/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind to scan all JS/JSX files
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // NEXORA Cyberpunk Intelligence Command Center Palette
      colors: {
        // Deep obsidian glass background shades
        dark: {
          950: "#020612",   // deepest void black
          900: "#040916",   // main app canvas
          800: "rgba(6, 14, 32, 0.88)",   // glass sidebar / topbar
          700: "rgba(10, 20, 44, 0.72)",  // glass cards
          600: "rgba(16, 32, 68, 0.65)",  // inner containers / hover
          500: "rgba(76, 215, 246, 0.22)", // cyan glass border
          400: "rgba(76, 215, 246, 0.45)", // active borders
        },
        // NEXORA Brand accent colors
        brand: {
          blue:   "#4cd7f6",  // primary neon cyan
          cyan:   "#06b6d4",  // primary container cyan
          purple: "#ddb7ff",  // secondary cyberpunk lavender
          green:  "#4edea3",  // tertiary emerald green
          red:    "#f43f5e",  // threat / negative rose red
          yellow: "#f59e0b",  // warning / neutral amber
          pink:   "#ec4899",  // viral trend highlight
        },
        // Text tokens
        surface: {
          DEFAULT: "#dae2fd",
          muted:   "#8ea0b5",
        }
      },
      // Typography: Geist for headlines/body + JetBrains Mono for telemetry/metrics
      fontFamily: {
        sans: ["Geist", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "cyan-glow": "0 0 20px rgba(76, 215, 246, 0.35)",
        "cyan-glow-sm": "0 0 10px rgba(76, 215, 246, 0.2)",
        "purple-glow": "0 0 20px rgba(221, 183, 255, 0.3)",
        "glass-card": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.14), 0 12px 34px rgba(0, 0, 0, 0.58), 0 0 1px rgba(76, 215, 246, 0.22)",
        "glass-strong": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.24), 0 20px 50px rgba(0, 0, 0, 0.72), 0 0 2px rgba(76, 215, 246, 0.30)",
        "glass-elevated": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.30), 0 24px 60px rgba(0, 0, 0, 0.85), 0 0 25px rgba(76, 215, 246, 0.25)",
      },
      backdropBlur: {
        "3xl": "28px",
      },
      // Custom animation for loading & futuristic transitions
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in":    "fadeIn 0.3s ease-in-out",
        "slide-up":   "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "glow-cyan":  "glowCyan 2s ease-in-out infinite",
        "glow-green": "glowGreen 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowCyan: {
          "0%, 100%": { boxShadow: "0 0 4px rgba(76,215,246,0.3)" },
          "50%":      { boxShadow: "0 0 14px rgba(76,215,246,0.7), 0 0 22px rgba(76,215,246,0.25)" },
        },
        glowGreen: {
          "0%, 100%": { boxShadow: "0 0 4px rgba(78,222,163,0.3)" },
          "50%":      { boxShadow: "0 0 14px rgba(78,222,163,0.7), 0 0 22px rgba(78,222,163,0.25)" },
        },
      },
    },
  },
  plugins: [],
}
