import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    '../../apps/web/index.html',
    '../../apps/web/src/**/*.{ts,tsx,js,jsx}',
    '../../packages/**/src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2563eb',
          foreground: '#f8fafc'
        }
      }
    }
  },
  plugins: []
};

export default config;
