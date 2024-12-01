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
        background: '#F2F2F5',
        'background-secondary': '#DFDEFC',
        text: '#111112',
        primary: '#13118A',
        secondary: '#75070E',
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
