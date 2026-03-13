/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          0: '#fffdf8',
          50: '#f7f4ee',
          100: '#f1ede4',
          200: '#e4dccb',
          300: '#d1c7b4',
          400: '#b8ab95',
        },
        ink: {
          900: '#1f1b16',
          700: '#2f2a23',
          500: '#5b5146',
          300: '#a89b8b',
        },
        primary: {
          50: '#e9f7f5',
          100: '#cdeee9',
          200: '#9fddd3',
          500: '#1e9d91',
          600: '#17857b',
          700: '#116a63',
          900: '#0b3b37',
        },
        warn: { 400: '#f2b84b', 50: '#fff7e6', 100: '#fdecc8' },
        success: { 400: '#3cbf8f', 50: '#e9fbf4', 100: '#cdf3e4' },
        danger: { 400: '#e76666', 50: '#fff1f1', 100: '#ffe0e0' },
        source: {
          quiz: '#1e9d91',
          syllabus: '#2f7f68',
          transcript: '#2e6f9b',
          slides: '#3a8f7a',
          study_guide: '#2c8e86',
          notes: '#b6782e',
          textbook: '#6c6258',
          web: '#9a8f84',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', '"Spline Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 10px 30px -18px rgba(19, 14, 7, 0.45), 0 4px 12px -6px rgba(19, 14, 7, 0.18)',
        'card-hover': '0 16px 40px -18px rgba(19, 14, 7, 0.5), 0 6px 16px -8px rgba(19, 14, 7, 0.22)',
        modal: '0 28px 80px -24px rgba(19, 14, 7, 0.55)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'float-in': 'floatIn 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        floatIn: { from: { opacity: 0, transform: 'translateY(14px) scale(0.98)' }, to: { opacity: 1, transform: 'translateY(0) scale(1)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.6 } },
      },
    },
  },
  plugins: [],
};
