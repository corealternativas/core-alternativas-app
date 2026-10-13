import styled from "styled-components";

interface StyledButtonProps {
  variant: "primary" | "secondary" | "outline";
  loading?: boolean;
}

export const StyledButton = styled.button<StyledButtonProps>`
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: ${({ variant, theme }) =>
    variant === "outline"
      ? `1px solid ${theme.colors.primary}`
      : "1px solid transparent"};
  padding: 0.75em 1.5em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: ${({ variant, theme }) =>
    variant === "primary"
      ? theme.colors.primary
      : variant === "secondary"
        ? theme.colors.secondary
        : "transparent"};
  color: ${({ variant, theme }) =>
    variant === "outline" ? theme.colors.primary : theme.colors.white};
  cursor: pointer;
  transition: all 0.25s ease;
  min-width: 120px;
  display: ${({ loading }) => (loading ? "flex" : "inline-block")};
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background-color: ${({ variant, theme }) =>
      variant === "primary"
        ? "#b85d00"
        : variant === "secondary"
          ? "#e8d4c0"
          : theme.colors.secondary};
    color: ${({ variant, theme }) =>
      variant === "outline" ? theme.colors.white : theme.colors.white};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus,
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const StyledSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
