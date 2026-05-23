import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))"
      },
      backgroundImage: {
        "radial-glow": "radial-gradient(circle at center, rgba(59,130,246,.4), transparent 45%)"
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        "badge-glow": "badgeGlow 2.6s ease-in-out infinite",
        "badge-sheen": "badgeSheen 3.4s ease-in-out infinite",
        "badge-text-shine": "badgeTextShine 4s linear infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        badgeGlow: {
          "0%, 100%": {
            boxShadow:
              "0 0 10px rgba(251, 191, 36, 0.4), 0 0 22px rgba(234, 179, 8, 0.18), inset 0 1px 0 rgba(253, 224, 71, 0.12)"
          },
          "50%": {
            boxShadow:
              "0 0 18px rgba(253, 224, 71, 0.65), 0 0 36px rgba(250, 204, 21, 0.35), inset 0 1px 0 rgba(254, 249, 195, 0.25)"
          }
        },
        badgeSheen: {
          "0%": { transform: "translateX(-120%) skewX(-14deg)" },
          "100%": { transform: "translateX(260%) skewX(-14deg)" }
        },
        badgeTextShine: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" }
        }
      }
    }
  },
  plugins: []
};

export default config;
