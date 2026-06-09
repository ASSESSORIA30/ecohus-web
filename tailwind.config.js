/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Soft sage green — el verd principal del logo
        sage: {
          50: '#F4F6F2',
          100: '#E5EBDF',
          200: '#CBD7C0',
          300: '#A8BC97',
          400: '#8FA68E',  // primary sage
          500: '#7A9476',
          600: '#5F7A5C',
          700: '#4A6048',
          800: '#3A4B39',
          900: '#293229',
        },
        // Anthracite gray — text principal
        anthracite: {
          50: '#F2F2F2',
          100: '#D9D9D9',
          200: '#B3B3B3',
          300: '#8C8C8C',
          400: '#666666',
          500: '#4D4D4D',
          600: '#3D3F3E',
          700: '#2C2E2D',  // primary anthracite
          800: '#1F2120',
          900: '#121413',
        },
        // Off-white / bone
        bone: {
          50: '#FDFCF9',
          100: '#FAFAF7',  // primary bone
          200: '#F5F2EC',
          300: '#EDE8DD',
          400: '#DFD8C7',
        },
        // Natural wood
        wood: {
          100: '#E9DBC4',
          200: '#D6BFA0',
          300: '#C9A876',  // warm tan
          400: '#B89770',
          500: '#9C7E55',
          600: '#7C6342',
          700: '#5A4830',
        },
        // Stone beige
        stone: {
          100: '#EFEBE2',
          200: '#E5E0D5',
          300: '#D4CFC4',
          400: '#B8B3A6',
          500: '#9A9588',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'hero': 'clamp(2.75rem, 8vw, 6.5rem)',
        'display': 'clamp(2.25rem, 5.5vw, 5rem)',
        'title': 'clamp(1.75rem, 3.5vw, 3.5rem)',
      },
      letterSpacing: {
        'tightest': '-0.04em',
        'tighter-2': '-0.025em',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'expo-in-out': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      animation: {
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
