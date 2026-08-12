/*
  Tailwind Configuration
  Mapped to CSS Variables (tokens.css) for a single source of truth.
*/

tailwind.config = {
    theme: {
      extend: {
        colors: {
          background: 'var(--c-bg)',
          surface: 'var(--c-surface)',
          'surface-light': 'var(--c-surface-light)', 
          border: 'var(--c-border)',
          text: 'var(--c-text)',
          muted: 'var(--c-muted)',         
          accent: 'var(--c-accent)',        
          'accent-hover': 'var(--c-accent-hover)',
        },
        fontFamily: {
          serif: ['Halant', 'serif'],
          sans: ['Inter', 'sans-serif'],
        },
        maxWidth: {
          'container': '1000px',
        },
        boxShadow: {
          'glow': 'var(--s-glow)',
          'card-hover': 'var(--s-card)',
        },
        animation: {
          'spin-slow': 'spin 3s linear infinite',
        }
      }
    }
  }