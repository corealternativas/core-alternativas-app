import styled, { keyframes } from "styled-components"

const spin = keyframes`
  to { transform: rotate(360deg); }
`

export const StyledSpinner = styled.div`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: ${spin} 0.8s linear infinite;
  margin-right: 8px;
`

interface StyledButtonProps {
  variant: "primary" | "secondary" | "outline"
}

export const StyledButton = styled.button<StyledButtonProps>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  transition: all 0.2s ease;

  svg {
    flex-shrink: 0;
  }

  ${({ variant, theme }) => {
    switch (variant) {
      case "primary":
        return `
          background-color: ${theme.colors.primary};
          color: ${theme.colors.white};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary};
            opacity: 0.9;
          }

          &:disabled {
            background-color: ${theme.colors.primary};
            opacity: 0.6;
            cursor: not-allowed;
          }
        `
      case "secondary":
        return `
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.text};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.secondary};
            opacity: 0.8;
          }

          &:disabled {
            background-color: ${theme.colors.secondary};
            opacity: 0.6;
            cursor: not-allowed;
          }
        `
      case "outline":
        return `
          background-color: transparent;
          border: 2px solid ${theme.colors.primary};
          color: ${theme.colors.primary};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary};
            color: ${theme.colors.white};
          }

          &:disabled {
            border-color: ${theme.colors.border};
            color: ${theme.colors.textSecondary};
            cursor: not-allowed;
          }
        `
      default:
        return ""
    }
  }};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
  }
`
