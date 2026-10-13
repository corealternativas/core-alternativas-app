import React from "react";
import {
  StyledCheckbox,
  StyledCheckboxLabel,
  StyledCheckboxInput,
} from "./Checkbox.style.ts";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, id, ...props }) => {
  const checkboxId =
    id || `checkbox-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <StyledCheckbox>
      <StyledCheckboxInput type="checkbox" id={checkboxId} {...props} />
      <StyledCheckboxLabel htmlFor={checkboxId}>{label}</StyledCheckboxLabel>
    </StyledCheckbox>
  );
};
