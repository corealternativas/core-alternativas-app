// Theme configuration for styled-components
export const theme = {
  colors: {
    primary: '#ce6b00',
    secondary: '#f1e4d4',
    background: '#ffffff',
    surface: '#f1e4d4',
    text: '#000000',
    textSecondary: '#666666',
    border: '#e0e0e0',
    white: '#ffffff',
    black: '#000000',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
  },
} as const

export type Theme = typeof theme
