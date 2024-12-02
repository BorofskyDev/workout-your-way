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
        background: '#343434',
        'background-secondary': '#2d2c33',
        text: '#e7e7e8',
        primary: '#7596e9',
        secondary: '#e92f3b',
        highlight: '#05522D',

        // Dark Theme Colors
        'background-dark': '#06060A',
        'background-secondary-dark': '#0F0F17',
        'text-dark': '#f1f5f9',
        'primary-dark': '#5362ED',
        'secondary-dark': '#E83F49',
        'highlight-dark': '#78F0B6',
      },
    },
  },
  plugins: [],
} satisfies Config
