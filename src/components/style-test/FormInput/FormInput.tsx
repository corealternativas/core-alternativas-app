import React from "react";
import {
  StyledFormInput,
  StyledLabel,
  StyledInput,
  StyledHelperText,
  RequiredIndicator,
} from "./FormInput.style.ts";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  required?: boolean;
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  helperText,
  required = false,
  error,
  id,
  ...props
}) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <StyledFormInput>
      <StyledLabel htmlFor={inputId}>
        {label}
        {required && <RequiredIndicator> *</RequiredIndicator>}
      </StyledLabel>
      <StyledInput
        id={inputId}
        required={required}
        error={!!error}
        {...props}
      />
      {error && <StyledHelperText error>{error}</StyledHelperText>}
      {helperText && !error && (
        <StyledHelperText>{helperText}</StyledHelperText>
      )}
    </StyledFormInput>
  );
};
