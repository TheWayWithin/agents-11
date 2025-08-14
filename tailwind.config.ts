import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Agents-11 Brand Colors
        brand: {
          blue: {
            DEFAULT: '#1a365d',
            50: '#f0f4f7',
            100: '#d9e6ef',
            200: '#b3ccdf',
            300: '#8db3cf',
            400: '#6799bf',
            500: '#1a365d',
            600: '#152b4a',
            700: '#102037',
            800: '#0b1524',
            900: '#060a11',
          },
          orange: {
            DEFAULT: '#ff6b35',
            50: '#fff4f0',
            100: '#ffe8de',
            200: '#ffd0bc',
            300: '#ffb899',
            400: '#ff9f77',
            500: '#ff6b35',
            600: '#e6512a',
            700: '#cc471f',
            800: '#b33d14',
            900: '#99330a',
          },
        },
        // Agent-11 Technical Suite Colors
        agent11: {
          strategist: '#8B5CF6',
          architect: '#2563EB',
          developer: '#10B981',
          tester: '#F97316',
          designer: '#EC4899',
          documenter: '#F59E0B',
          operator: '#6B7280',
          support: '#06B6D4',
          analyst: '#6366F1',
          marketer: '#EF4444',
          coordinator: '#D97706',
        },
        // Empire-11 Business Suite Colors
        empire11: {
          sage: '#FFD700',
          nova: '#ff6b35',
          astra: '#8B5CF6',
          phoenix: '#14B8A6',
          rex: '#374151',
          zara: '#10B981',
          alex: '#3B82F6',
          luna: '#EC4899',
          kai: '#8B5CF6',
          bob: '#ff6b35',
          echo: '#EF4444',
        },
        // Status Colors
        status: {
          active: '#10B981',
          inactive: '#6B7280',
          loading: '#F59E0B',
          error: '#EF4444',
          success: '#10B981',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // Design System Extensions
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      boxShadow: {
        'brand': '0 4px 14px 0 rgba(26, 54, 93, 0.1)',
        'agent': '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(255, 107, 53, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1a365d 0%, #2563EB 100%)',
        'agent-gradient': 'linear-gradient(135deg, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/forms')],
};
export default config;
