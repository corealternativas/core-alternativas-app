import styled from "styled-components";

export const StyledChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const StyledChip = styled.button<{
  $selected: boolean;
  $disabled: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.9375rem;
  font-family: inherit;
  font-weight: 500;
  line-height: 1.2;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  user-select: none;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    transform 0.05s ease;
  opacity: ${({ $disabled, $selected }) =>
    $disabled && !$selected ? 0.4 : 1};

  background-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : theme.colors.white};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.white : theme.colors.text};
  border: 1.5px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : theme.colors.border};

  &:hover:not(:disabled) {
    ${({ $selected, theme }) =>
      $selected
        ? `
          background-color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};
        `
        : `
          border-color: ${theme.colors.primary};
          background-color: ${theme.colors.primary}10;
          color: ${theme.colors.primary};
        `}
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

