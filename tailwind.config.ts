import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      keyframes: {
        'shimmer-top': {
          from: { transform: 'scaleX(0)', opacity: '0' },
          to: { transform: 'scaleX(1)', opacity: '1' },
        },
        'shimmer-bottom': {
          from: { transform: 'scaleX(0)', opacity: '0' },
          to: { transform: 'scaleX(1)', opacity: '1' },
        },
        'shimmer-right': {
          from: { transform: 'scaleY(0)', opacity: '0' },
          to: { transform: 'scaleY(1)', opacity: '1' },
        },
        'shimmer-left': {
          from: { transform: 'scaleY(0)', opacity: '0' },
          to: { transform: 'scaleY(1)', opacity: '1' },
        },
        'badge-slide': {
          from: { transform: 'translateY(8px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'price-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
      },
      animation: {
        'shimmer-top': 'shimmer-top 700ms ease-out forwards',
        'shimmer-bottom': 'shimmer-bottom 700ms ease-out forwards',
        'shimmer-right': 'shimmer-right 700ms ease-out forwards',
        'shimmer-left': 'shimmer-left 700ms ease-out forwards',
        'badge-slide': 'badge-slide 300ms ease-out forwards',
        'price-pulse': 'price-pulse 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
