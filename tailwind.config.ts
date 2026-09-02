import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0f172a',
          800: '#1e293b',
        },
        gold: {
          DEFAULT: '#fbbf24',
          accent: '#d97706'
        },
        slate: {
          100: '#f1f5f9',
          200: '#e2e8f0',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      borderRadius: {
        DEFAULT: '0.25rem', // Minimal rounded corners
      }
    },
  },
  plugins: [],
} satisfies Config;
