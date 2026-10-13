import styled from "styled-components"

export const StyledWrapper = styled.div<{ $readOnly?: boolean }>`
  overflow-x: auto;
  overflow-y: visible;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.white};
  -webkit-user-select: none;
  user-select: none;
  /* Always allow native touch pan (scroll) — otherwise mobile users can't reach
     off-screen cells. Drag-to-paint stays fully working with mouse on desktop;
     on touch devices painting happens per-tap (drag is intentionally disabled). */
  touch-action: pan-x pan-y;
`

export const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: 640px;
  font-size: 0.85rem;
`

export const StyledCornerCell = styled.th`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  width: 60px;
  position: sticky;
  left: 0;
  z-index: 2;
`

const tooltipStyles = `
  &[data-tooltip]::after {
    content: attr(data-tooltip);
    position: absolute;
    top: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.85);
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.12s ease;
    z-index: 20;
  }
  &[data-tooltip]::before {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-bottom-color: rgba(0, 0, 0, 0.85);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.12s ease;
    z-index: 20;
  }
  &[data-tooltip]:hover::after,
  &[data-tooltip]:hover::before {
    opacity: 1;
  }
`

export const StyledHeaderCell = styled.th<{ $clickable?: boolean }>`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  transition: background-color 0.1s ease;
  user-select: none;
  position: relative;

  ${({ $clickable, theme }) =>
    $clickable &&
    `
      &:hover {
        background-color: ${theme.colors.primary};
        color: ${theme.colors.white};
      }
    `}

  ${tooltipStyles}

  &:last-child {
    border-right: none;
  }
`

export const StyledHourCell = styled.td<{ $clickable?: boolean }>`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 0.35rem 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: right;
  width: 60px;
  position: sticky;
  left: 0;
  z-index: 1;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  transition: background-color 0.1s ease, color 0.1s ease;
  user-select: none;

  ${({ $clickable, theme }) =>
    $clickable &&
    `
      &:hover {
        background-color: ${theme.colors.primary};
        color: ${theme.colors.white};
      }
    `}

  &[data-tooltip]::after {
    content: attr(data-tooltip);
    position: absolute;
    top: 50%;
    left: calc(100% + 6px);
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.85);
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.12s ease;
    z-index: 20;
  }
  &[data-tooltip]::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-right-color: rgba(0, 0, 0, 0.85);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.12s ease;
    z-index: 20;
  }
  &[data-tooltip]:hover::after,
  &[data-tooltip]:hover::before {
    opacity: 1;
  }
`

interface DataCellProps {
  $color?: string
  $readOnly?: boolean
}

export const StyledDataCell = styled.td<DataCellProps>`
  padding: 0;
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ $color, theme }) => $color || theme.colors.white};
  cursor: ${({ $readOnly }) => ($readOnly ? "default" : "pointer")};
  color: rgba(0, 0, 0, 0.68);
  height: 28px;
  min-width: 40px;
  transition: background-color 0.08s ease;

  &:last-child {
    border-right: none;
  }

  svg {
    display: inline-block;
    vertical-align: middle;
  }

  ${({ $readOnly }) =>
    !$readOnly &&
    `
      &:hover {
        filter: brightness(0.96);
      }
    `}
`
