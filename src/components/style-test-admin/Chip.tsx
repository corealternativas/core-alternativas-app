import React from "react"
import { StyledChip, type ChipVariant } from "./Chip.style"

interface ChipProps {
  value: string
  variant?: ChipVariant
}

// Deterministic color bucket (0-9) for a value; same hash as the design mock.
function hashIdx(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h % 10
}

export const Chip: React.FC<ChipProps> = ({ value, variant = "palette" }) => (
  <StyledChip $variant={variant} $idx={hashIdx(value)}>
    {value}
  </StyledChip>
)
