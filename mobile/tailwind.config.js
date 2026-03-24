/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          sand: '#FFFFFF',
          'sand-strong': '#F4F4F4',
          'accent-light': '#F0F9F3',
          clay: '#0E7051',
          'clay-strong': '#0A6B40',
          ink: '#0A0A0A',
          'ink-soft': '#525252',
          mint: '#0E7051',
          gold: '#F59E0B',
          card: '#FAFAFA',
          border: '#E5E5E5',
          danger: '#DC2626',
          success: '#16A34A',
        },
      },
      fontFamily: {
        inter: ['Inter'],
        sans: ['Inter'],
        rounded: ['Inter'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 6px rgba(0,0,0,0.07)',
        lg: '0 10px 15px rgba(0,0,0,0.1)',
      },
    },
  },
};
