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
          DEFAULT: '#4C6EF5',
          foreground: '#F8FAFC',
          soft: '#EEF2FF',
        },
        accent: {
          DEFAULT: '#F97316',
          foreground: '#FFF7ED',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        muted: '#94A3B8',
        surface: {
          DEFAULT: '#0F172A',
          elevated: '#111C44',
          subtle: '#1E293B',
        },
        border: '#23324D',
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'glow': '0 20px 45px -15px rgba(76, 110, 245, 0.45)',
        'soft': '0 12px 35px -20px rgba(15, 23, 42, 0.6)',
        'card': '0 18px 40px -12px rgba(15, 23, 42, 0.45)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top left, rgba(79, 70, 229, 0.35), transparent 55%), radial-gradient(circle at bottom right, rgba(249, 115, 22, 0.25), transparent 45%)',
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '1.75rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

