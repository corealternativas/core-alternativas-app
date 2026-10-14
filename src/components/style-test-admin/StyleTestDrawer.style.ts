import styled from "styled-components"

export const Backdrop = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: var(--backdrop-bg);
  backdrop-filter: blur(var(--backdrop-blur));
  -webkit-backdrop-filter: blur(var(--backdrop-blur));
  z-index: 100;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: opacity 0.18s ease;
`

export const Drawer = styled.aside<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(92vw, 720px);
  background: ${({ theme }) => theme.colors.white};
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: -16px 0 48px rgba(0, 0, 0, 0.25);
  z-index: 101;
  overflow-y: auto;
  transform: ${({ $open }) => ($open ? "translateX(0)" : "translateX(100%)")};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transition:
    transform 0.22s cubic-bezier(0.2, 0.9, 0.3, 1),
    visibility 0.22s linear;
`

export const DrawerHead = styled.div`
  position: sticky;
  top: 0;
  padding: 20px 24px;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.secondary} 0%,
    ${({ theme }) => theme.colors.white} 100%
  );
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: 16px;
  align-items: flex-start;
  z-index: 1;
`

export const Avatar = styled.span`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 17px;
  flex-shrink: 0;
`

export const HeadText = styled.div`
  min-width: 0;
  flex: 1;
`

export const DrawerName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0;
  overflow-wrap: anywhere;
`

export const DrawerMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 4px;

  a {
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`

export const DrawerActions = styled.div`
  display: inline-flex;
  gap: 6px;
  align-items: center;
  margin-left: auto;
  flex-shrink: 0;
`

export const IconButton = styled.button`
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 6px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--surface-soft);
  }

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: var(--focus-ring);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

export const DrawerBody = styled.div`
  padding: 24px;
`

export const Section = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`

export const SectionHeading = styled.p`
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 600;
  margin: 0 0 12px;
`

export const Quote = styled.div<{ $empty?: boolean }>`
  background: var(--surface-soft);
  border-left: 3px solid
    ${({ $empty, theme }) => ($empty ? "var(--border-strong)" : theme.colors.primary)};
  padding: 14px 16px;
  border-radius: 0 6px 6px 0;
  font-size: 14px;
  line-height: 1.6;
  color: ${({ $empty, theme }) => ($empty ? "var(--text-muted)" : theme.colors.text)};
  font-style: ${({ $empty }) => ($empty ? "italic" : "normal")};
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const ResultsBig = styled.div`
  display: grid;
  gap: 8px;
`

export const ResultRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 6px;
`

export const ResultRank = styled.span`
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-ink);
  width: 24px;
`

export const ResultName = styled.span`
  flex: 1;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

export const KvGrid = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 16px;
  margin: 0;
`

export const KvItem = styled.div`
  background: var(--surface-soft);
  border-radius: 6px;
  padding: 10px 12px;

  dt {
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    font-weight: 600;
    margin: 0 0 4px;
  }

  dd {
    margin: 0;
    font-size: 13.5px;
    color: ${({ theme }) => theme.colors.text};
    overflow-wrap: anywhere;
  }
`

export const Muted = styled.em`
  color: var(--text-muted);
`

export const Optins = styled.div`
  display: grid;
  gap: 8px;
`

export const Optin = styled.div<{ $yes: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  padding: 8px 12px;
  background: var(--surface-soft);
  border-radius: 6px;
  color: ${({ $yes }) => ($yes ? "var(--success)" : "var(--text-muted)")};
`

export const Metadata = styled.div`
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--text-muted);
  background: var(--surface-soft);
  padding: 12px 14px;
  border-radius: 6px;

  div {
    padding: 2px 0;
    word-break: break-all;
  }

  strong {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 500;
  }
`

export const NotionStatus = styled.span<{ $ok: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ $ok }) => ($ok ? "var(--success)" : "var(--warn)")};
`
