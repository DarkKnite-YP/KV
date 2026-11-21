/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'orchard-green': '#344B36',
        'deep-forest': '#243629',
        'dawn-gold': '#D6A64B',
        'mango-cream': '#F7F2E8',
        'earth-brown': '#806247',
        'soft-sage': '#DCE4D6',
        'charcoal': '#292A25',
      },
      fontFamily: {
        'display': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        'body': ['Manrope', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'section': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'subtitle': ['clamp(1.25rem, 2.5vw, 1.75rem)', { lineHeight: '1.3' }],
      },
      spacing: {
        'section': 'clamp(4rem, 8vw, 8rem)',
        'section-sm': 'clamp(3rem, 6vw, 6rem)',
      },
      maxWidth: {
        'content': '72rem',
        'reading': '42rem',
        'wide': '90rem',
      },
      borderRadius: {
        'soft': '0.75rem',
        'softer': '1rem',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(41, 42, 37, 0.06), 0 1px 2px rgba(41, 42, 37, 0.04)',
        'card-hover': '0 4px 12px rgba(41, 42, 37, 0.08), 0 2px 4px rgba(41, 42, 37, 0.04)',
        'elevated': '0 8px 24px rgba(41, 42, 37, 0.1), 0 4px 8px rgba(41, 42, 37, 0.06)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
      },
    },
  },
  plugins: [],
}

