import styled, { css } from "styled-components"

export type ChipVariant = "palette" | "subtle" | "source-app" | "source-notion"

interface StyledChipProps {
  $variant: ChipVariant
  $idx: number
}

export const StyledChip = styled.span<StyledChipProps>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1.5;

  ${({ $variant, $idx }) => {
    switch ($variant) {
      case "subtle":
        return css`
          background: var(--surface-soft);
          color: ${({ theme }) => theme.colors.textSecondary};
        `
      case "source-app":
        return css`
          background: var(--chip-app-bg);
          color: var(--chip-app-ink);
        `
      case "source-notion":
        return css`
          background: var(--chip-notion-bg);
          color: var(--chip-notion-ink);
        `
      default:
        return css`
          background: var(--p${$idx}-bg);
          color: var(--p${$idx}-ink);
        `
    }
  }}
`
