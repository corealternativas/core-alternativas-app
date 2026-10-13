import styled, { keyframes } from "styled-components";

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

interface StyledSnackbarProps {
  variant: "success" | "error";
  $isClosing: boolean;
}

export const StyledSnackbar = styled.div<StyledSnackbarProps>`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  min-width: 280px;
  max-width: 90vw;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.4;
  animation: ${({ $isClosing }) => ($isClosing ? slideOut : slideIn)} 0.3s ease
    forwards;
  background-color: ${({ variant, theme }) =>
    variant === "success" ? theme.colors.primary : "#b91c1c"};
  color: ${({ theme }) => theme.colors.white};
`;
