import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {

      // ─── COLORES INSTITUCIONALES ───────────────────────────────────────────
      colors: {
        // Azul marino institucional (del escudo)
        navy: {
          50:  '#E8EFF8',
          200: '#A8C0E8',
          400: '#4B78C8',
          600: '#2451A0',
          800: '#1B3A6B',   // ← primario principal
          950: '#0F2347',
        },
        // Dorado institucional (del escudo)
        gold: {
          50:  '#FEF0CC',
          300: '#F9C55A',
          500: '#F5A623',   // ← dorado institucional
          700: '#C67D0A',
        },
        // Grises neutros
        neutral: {
          50:  '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Estados semánticos
        success: {
          DEFAULT: '#16A34A',
          light:   '#F0FDF4',
          border:  '#86EFAC',
          text:    '#15803D',
        },
        danger: {
          DEFAULT: '#DC2626',
          light:   '#FEF2F2',
          border:  '#FCA5A5',
          text:    '#B91C1C',
        },
        warning: {
          DEFAULT: '#D97706',
          light:   '#FFFBEB',
          border:  '#FDE68A',
          text:    '#B45309',
        },
        info: {
          DEFAULT: '#2563EB',
          light:   '#EFF6FF',
          border:  '#BFDBFE',
          text:    '#1D4ED8',
        },
      },

      // ─── TIPOGRAFÍA ────────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        'label':   ['12px', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.06em' }],
        'body-sm': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        'body':    ['15px', { lineHeight: '1.6', fontWeight: '400' }],
        'h3':      ['17px', { lineHeight: '1.3', fontWeight: '600' }],
        'h2':      ['22px', { lineHeight: '1.3', fontWeight: '600' }],
        'h1':      ['32px', { lineHeight: '1.2', fontWeight: '700' }],
      },

      // ─── ESPACIADO ─────────────────────────────────────────────────────────
      // Usa el sistema base de Tailwind (múltiplos de 4px).
      // Aliases semánticos adicionales:
      spacing: {
        'xs':  '4px',
        'sm':  '8px',
        'md':  '12px',
        'lg':  '16px',
        'xl':  '24px',
        '2xl': '32px',
        '3xl': '48px',
      },

      // ─── BORDER RADIUS ─────────────────────────────────────────────────────
      borderRadius: {
        'none':  '0',
        'sm':    '4px',
        'btn':   '8px',    // botones, inputs, chips
        'card':  '12px',   // cards, modales, panels
        'carnet':'16px',   // carnet digital
        'pill':  '9999px', // badges, avatares
        // defaults de Tailwind se mantienen (md=6px, lg=8px, xl=12px, etc.)
      },

      // ─── BOX SHADOW ────────────────────────────────────────────────────────
      boxShadow: {
        // Sin sombras decorativas — solo funcionales
        'focus-navy': '0 0 0 3px rgba(27, 58, 107, 0.12)',
        'focus-gold': '0 0 0 3px rgba(245, 166, 35, 0.25)',
        'focus-danger': '0 0 0 3px rgba(220, 38, 38, 0.10)',
        'carnet': '0 8px 32px rgba(27, 58, 107, 0.35)',
        'card': '0 1px 4px rgba(0, 0, 0, 0.06)',
      },

      // ─── BREAKPOINTS ───────────────────────────────────────────────────────
      // Los de Tailwind por defecto son correctos:
      // sm: 640px · md: 768px · lg: 1024px · xl: 1280px · 2xl: 1536px

    },
  },

  // ─── PLUGINS ─────────────────────────────────────────────────────────────
  plugins: [],
}

export default config


// ─── REFERENCIA RÁPIDA ───────────────────────────────────────────────────────
//
//  PRIMARIOS
//  bg-navy-800        → azul institucional principal   #1B3A6B
//  bg-gold-500        → dorado institucional           #F5A623
//  text-navy-800      → texto sobre fondo claro
//  text-gold-700      → texto dorado sobre fondo claro #C67D0A
//
//  BOTONES
//  bg-navy-800 text-white            → btn primary
//  bg-gold-500 text-navy-800         → btn gold
//  border-navy-800 text-navy-800     → btn outline
//  border-neutral-300 text-neutral-500 → btn ghost
//
//  BADGES
//  bg-success-light text-success-text   → cuota al día
//  bg-danger-light text-danger-text     → cuota vencida
//  bg-warning-light text-warning-text   → advertencia
//  bg-info-light text-info-text         → información
//
//  CARDS
//  bg-white border border-neutral-300 rounded-card p-lg
//
//  INPUTS
//  border border-neutral-300 rounded-btn h-[38px] px-3 text-body
//  focus:border-navy-800 focus:shadow-focus-navy
//  [error]: border-danger-DEFAULT focus:shadow-focus-danger
//
//  FONDOS DE SECCIÓN
//  bg-navy-50         → sección con tinte institucional suave
//  bg-gold-50         → aviso / highlight dorado
//  bg-neutral-100     → superficie neutra
//
// ─────────────────────────────────────────────────────────────────────────────
