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
  min-width: 240px;
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

export const ColsMenuItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    background: var(--surface-soft);
  }

  input[type="checkbox"] {
    accent-color: ${({ theme }) => theme.colors.primary};
    margin: 0;
  }
`
