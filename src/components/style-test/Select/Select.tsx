import React from "react";
import {
  StyledSelect,
  StyledLabel,
  StyledSelectElement,
  StyledHelperText,
  RequiredIndicator,
} from "./Select.style.ts";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  helperText?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  helperText,
  required = false,
  error,
  placeholder = "Selecciona una opción",
  id,
  ...props
}) => {
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <StyledSelect>
      <StyledLabel htmlFor={selectId}>
        {label}
        {required && <RequiredIndicator> *</RequiredIndicator>}
      </StyledLabel>
      <StyledSelectElement
        id={selectId}
        required={required}
        error={!!error}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelectElement>
      {error && <StyledHelperText error>{error}</StyledHelperText>}
      {helperText && !error && (
        <StyledHelperText>{helperText}</StyledHelperText>
      )}
    </StyledSelect>
  );
};
