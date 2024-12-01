// tailwind.config.ts

import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light Theme Colors
        background: '#f8fafc', // Tailwind's slate-100
        'background-secondary': '#e2e8f0', // Tailwind's slate-200
        text: '#2d3748', // Tailwind's stone-700
        primary: '#4c0519', // Tailwind's rose-950
        secondary: '#1e1b4b', // Tailwind's indigo-950
        highlight: '#022c22', // Tailwind's emerald-950

        // Dark Theme Colors
        'background-dark': '#1e293b', // Tailwind's slate-800
        'background-secondary-dark': '#334155', // Tailwind's slate-700
        'text-dark': '#f1f5f9', // Tailwind's stone-100
        'primary-dark': '#fecdd3', // Tailwind's rose-200 (same as light)
        'secondary-dark': '#c7d2fe', // Tailwind's indigo-200 (same as light)
        'highlight-dark': '#a7f3d0', // Tailwind's emerald-200(same as light)
      },
    },
  },
  plugins: [],
} satisfies Config
