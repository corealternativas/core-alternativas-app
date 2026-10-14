import styled from "styled-components"

export const ColsMenuWrap = styled.div`
  position: relative;
`

export const ColsMenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;

  &:hover,
  &[aria-expanded="true"] {
    background: var(--surface-soft);
  }

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: var(--focus-ring);
  }
`

export const ColsMenuPanel = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.12);
  padding: 12px;
  min-width: 260px;
  max-height: min(70vh, 480px);
  overflow-y: auto;
  z-index: 20;
`

export const ColsMenuHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 8px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 8px;

  button {
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.primary};
    font: inherit;
    font-size: 11.5px;
    text-transform: none;
    letter-spacing: 0;
    cursor: pointer;
    padding: 2px 4px;
  }
`

interface ColsMenuRowProps {
  $dragging?: boolean
  $drop?: "before" | "after" | null
}

// One column row: [grip | arrows] [checkbox + label]. While dragging, the row
// under the pointer shows a thick primary line on the edge the item will land on.
export const ColsMenuRow = styled.div<ColsMenuRowProps>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px 2px 4px;
  border-radius: 6px;
  opacity: ${({ $dragging }) => ($dragging ? 0.4 : 1)};
  box-shadow: ${({ $drop, theme }) =>
    $drop === "before"
      ? `0 -2px 0 0 ${theme.colors.primary}`
      : $drop === "after"
        ? `0 2px 0 0 ${theme.colors.primary}`
        : "none"};

  &:hover {
    background: var(--surface-soft);
  }

  &[draggable="true"] {
    cursor: grab;
  }

  &[draggable="true"]:active {
    cursor: grabbing;
  }
`

export const ColsMenuHandle = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 4px 2px;
  color: var(--text-muted);
  cursor: grab;
`

export const ColsMenuLabel = styled.label`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  cursor: pointer;
  font-size: 13px;
  min-width: 0;

  input[type="checkbox"] {
    accent-color: ${({ theme }) => theme.colors.primary};
    margin: 0;
  }

  input[type="checkbox"]:focus {
    outline: none;
  }

  input[type="checkbox"]:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

// Touch fallback: up/down pair instead of the drag handle.
export const ColsMenuArrows = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
`

export const ColsMenuArrow = styled.button`
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--surface-soft);
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`
