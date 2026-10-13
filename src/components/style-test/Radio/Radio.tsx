import React from "react";
import {
  StyledRadio,
  StyledRadioLabel,
  StyledRadioInput,
} from "./Radio.style.ts";

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

export const Radio: React.FC<RadioProps> = ({ label, name, id, ...props }) => {
  const radioId =
    id || `radio-${name}-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <StyledRadio>
      <StyledRadioInput type="radio" name={name} id={radioId} {...props} />
      <StyledRadioLabel htmlFor={radioId}>{label}</StyledRadioLabel>
    </StyledRadio>
  );
};
