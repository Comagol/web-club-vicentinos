/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primarios institucionales — Azul marino (design system)
        navy: {
          950: '#0F2347',
          800: '#1B3A6B',
          600: '#2451A0',
          400: '#4B78C8',
          200: '#A8C0E8',
          50: '#E8EFF8',
        },
        // Secundarios institucionales — Dorado (design system)
        gold: {
          700: '#C67D0A',
          500: '#F5A623',
          300: '#F9C55A',
          50: '#FEF0CC',
        },
        // Neutros (design system)
        gray: {
          900: '#111827',
          700: '#374151',
          500: '#6B7280',
          300: '#D1D5DB',
          100: '#F3F4F6',
        },
        // Estados semánticos
        success: '#16A34A',
        danger: '#DC2626',
        warning: '#D97706',
        info: '#2563EB',
        // Backgrounds de estados semánticos
        'success-bg': '#F0FDF4',
        'success-text': '#15803D',
        'success-border': '#86EFAC',
        'danger-bg': '#FEF2F2',
        'danger-text': '#B91C1C',
        'danger-border': '#FCA5A5',
        'warning-bg': '#FFFBEB',
        'warning-text': '#B45309',
        'warning-border': '#FDE68A',
        'info-bg': '#EFF6FF',
        'info-text': '#1D4ED8',
        'info-border': '#BFDBFE',
      },
      borderRadius: {
        // Custom border radius (design system)
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        pill: '9999px',
      },
      spacing: {
        // Custom spacing based on 4px base (design system)
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
      },
      fontSize: {
        // Typography scale (design system)
        h1: ['32px', { fontWeight: '700', lineHeight: '1.2' }],
        h2: ['22px', { fontWeight: '600', lineHeight: '1.3' }],
        h3: ['17px', { fontWeight: '600', lineHeight: '1.3' }],
        body: ['15px', { fontWeight: '400', lineHeight: '1.6' }],
        'body-small': ['13px', { fontWeight: '400', lineHeight: '1.6' }],
        label: ['12px', { fontWeight: '500', letterSpacing: '0.06em' }],
        caption: ['12px', { fontWeight: '400', lineHeight: '1.5' }],
      },
      fontWeight: {
        400: '400',
        500: '500',
        600: '600',
        700: '700',
      },
      // Custom utility classes
      rounded: {
        btn: '8px',
      },
      scale: {
        97: '0.97',
      },
    },
  },
  plugins: [
    function({ addUtilities, theme }) {
      // Add neutral color aliases to gray
      const neutralAliases = {
        '.text-neutral-300': { color: theme('colors.gray.300') },
        '.text-neutral-500': { color: theme('colors.gray.500') },
        '.border-neutral-300': { borderColor: theme('colors.gray.300') },
        '.bg-neutral-300': { backgroundColor: theme('colors.gray.300') },
      }
      addUtilities(neutralAliases)
    },
  ],
};
