import React from "react";
import { StyledButton, StyledSpinner } from "./Button.style.ts";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  loading = false,
  children,
  disabled,
  ...props
}) => {
  return (
    <StyledButton variant={variant} disabled={disabled || loading} {...props}>
      {loading && <StyledSpinner />}
      {children}
    </StyledButton>
  );
};
