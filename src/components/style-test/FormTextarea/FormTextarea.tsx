import React from "react";
import {
  StyledFormTextarea,
  StyledLabel,
  StyledTextarea,
  StyledHelperText,
  RequiredIndicator,
} from "./FormTextarea.style.ts";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
  required?: boolean;
  error?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  helperText,
  required = false,
  error,
  id,
  ...props
}) => {
  const textareaId =
    id || `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <StyledFormTextarea>
      <StyledLabel htmlFor={textareaId}>
        {label}
        {required && <RequiredIndicator> *</RequiredIndicator>}
      </StyledLabel>
      <StyledTextarea
        id={textareaId}
        required={required}
        error={!!error}
        {...props}
      />
      {error && <StyledHelperText error>{error}</StyledHelperText>}
      {helperText && !error && (
        <StyledHelperText>{helperText}</StyledHelperText>
      )}
    </StyledFormTextarea>
  );
};
