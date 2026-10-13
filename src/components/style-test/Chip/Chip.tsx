import React from "react";
import { StyledChip } from "./Chip.style";

interface ChipProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected,
  disabled = false,
  onClick,
}) => {
  return (
    <StyledChip
      type="button"
      role="checkbox"
      aria-checked={selected}
      $selected={selected}
      $disabled={disabled}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </StyledChip>
  );
};
