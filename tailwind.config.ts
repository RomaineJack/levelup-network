import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: {
          950: '#05050a',
          900: '#0a0a12',
          800: '#111120',
          700: '#1a1a2e',
          600: '#252540',
        },
        neon: {
          green: '#00ff88',
          cyan: '#00e5ff',
          orange: '#ff6b35',
          pink: '#ff00aa',
          yellow: '#ffcc00',
        },
        gaming: {
          card: '#111120',
          border: '#252540',
          muted: '#6b6b8a',
        },
      },
    },
  },
  plugins: [],
};

export default config;