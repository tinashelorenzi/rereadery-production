/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#556B2F',
          light: '#6B8E23',
          dark: '#3D4F21',
        },
        secondary: {
          DEFAULT: '#000080',
          light: '#0000CD',
          dark: '#00004D',
        },
        background: '#F8FAF5',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(107, 142, 35, 0.3)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      backdropBlur: {
        'glass': '8px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

