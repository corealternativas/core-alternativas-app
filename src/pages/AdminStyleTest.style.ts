import styled from "styled-components"

const SELECT_CHEVRON = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b6760' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>")`

export const Container = styled.div`
  min-width: 0;
`

export const PageTitle = styled.h1`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`

/* ───── Metrics ───── */

export const Metrics = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin: 20px 0 24px;

  @media (max-width: 820px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

export const Metric = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 16px 20px;
  min-width: 0;
`

export const MetricLabel = styled.div`
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 600;
`

export const MetricValue = styled.div<{ $small?: boolean }>`
  font-size: ${({ $small }) => ($small ? "20px" : "28px")};
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-top: 8px;
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
  ${({ $small }) => ($small ? "line-height: 1.5;" : "")}
`

export const MetricSub = styled.div`
  display: inline-flex;
  gap: 6px;
  align-items: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 8px;

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
  }
`

/* ───── Filters ───── */

export const FiltersBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  background: ${({ theme }) => theme.colors.white};
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  margin-bottom: 16px;
`

export const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;

  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    pointer-events: none;
  }
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 9px 12px 9px 34px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 13.5px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: var(--focus-ring);
  }
`

export const DateRange = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.background};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: var(--focus-ring);
  }

  svg {
    color: var(--text-muted);
    flex-shrink: 0;
  }

  input {
    appearance: none;
    border: none;
    background: transparent;
    padding: 9px 2px;
    color: ${({ theme }) => theme.colors.text};
    font-family: inherit;
    font-size: 13px;
    width: 118px;
    color-scheme: light;
  }

  input:focus {
    outline: none;
  }
`

export const DateSep = styled.span`
  color: var(--text-muted);
  font-size: 12px;
  padding: 0 2px;
`

export const Select = styled.select<{ $compact?: boolean }>`
  appearance: none;
  padding: ${({ $compact }) => ($compact ? "6px 28px 6px 10px" : "9px 32px 9px 12px")};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.background} ${SELECT_CHEVRON} right 10px center / 12px no-repeat;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: ${({ $compact }) => ($compact ? "12px" : "13.5px")};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: var(--focus-ring);
  }
`

export const ExportButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--accent-ink);
    border-color: var(--accent-ink);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  &:disabled {
    opacity: 0.6;
    cursor: progress;
  }
`

export const ErrorBanner = styled.div`
  background: var(--accent-soft);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 3px solid var(--warn);
  padding: 10px 14px;
  border-radius: 0 6px 6px 0;
  font-size: 13px;
  color: var(--warn);
  margin-bottom: 16px;
`

/* ───── Table ───── */

export const TableWrap = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`

export const TableScroll = styled.div<{ $loading?: boolean }>`
  overflow-x: auto;
  opacity: ${({ $loading }) => ($loading ? 0.55 : 1)};
  transition: opacity 0.15s ease;
`

export const DataTable = styled.table`
  width: 100%;
  /* 17 columns: keep every column at its natural width and let TableScroll
     scroll horizontally, instead of squeezing chip/text cells into tall rows. */
  min-width: max-content;
  border-collapse: collapse;
  font-size: 13.5px;

  th {
    text-align: left;
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 600;
    padding: 10px 14px;
    background: var(--surface-soft);
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    white-space: nowrap;
    user-select: none;
  }

  th.sortable {
    cursor: pointer;
  }

  th.sortable:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.secondary};
  }

  th.sortable:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px ${({ theme }) => theme.colors.primary};
  }

  th .colhead {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  th .sorticon {
    display: inline-flex;
    align-items: center;
    color: var(--text-muted);
    opacity: 0.5;
  }

  th.is-sorted .sorticon {
    color: ${({ theme }) => theme.colors.primary};
    opacity: 1;
  }

  td {
    padding: 12px 14px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    vertical-align: top;
  }

  tbody tr {
    cursor: pointer;
  }

  tbody tr:hover {
    background: var(--surface-soft);
  }

  tbody tr:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px ${({ theme }) => theme.colors.primary};
  }

  tbody tr.is-selected {
    background: var(--accent-soft);
    box-shadow: inset 3px 0 0 ${({ theme }) => theme.colors.primary};
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  th.is-hidden,
  td.is-hidden {
    display: none;
  }
`

export const CellDate = styled.span`
  font-family: var(--font-mono);
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`

export const CellNowrap = styled.span<{ $secondary?: boolean }>`
  white-space: nowrap;
  ${({ $secondary, theme }) => ($secondary ? `color: ${theme.colors.textSecondary};` : "")}
`

export const CellText = styled.div`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 240px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: anywhere;
`

export const Dash = styled.span`
  color: var(--text-muted);
`

export const ChipsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 340px;
`

export const Check = styled.span<{ $yes?: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ $yes, theme }) => ($yes ? theme.colors.primary : "var(--surface-soft)")};
  color: ${({ $yes, theme }) => ($yes ? theme.colors.white : "var(--text-muted)")};
  border: 1px solid
    ${({ $yes, theme }) => ($yes ? theme.colors.primary : theme.colors.border)};

  svg {
    display: block;
  }
`

export const StatusMessage = styled.div`
  padding: 32px 16px;
  text-align: center;
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

/* ───── Pagination ───── */

export const PaginationBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: var(--surface-soft);
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const PaginationPages = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
`

export const PageButton = styled.button<{ $current?: boolean }>`
  min-width: 32px;
  padding: 6px 10px;
  border: 1px solid ${({ $current, theme }) => ($current ? theme.colors.primary : theme.colors.border)};
  border-radius: 6px;
  background: ${({ $current, theme }) => ($current ? theme.colors.primary : theme.colors.white)};
  color: ${({ $current, theme }) => ($current ? theme.colors.white : theme.colors.textSecondary)};
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    ${({ $current }) => ($current ? "" : "background: var(--surface-soft);")}
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`

export const Ellipsis = styled.span`
  padding: 0 6px;
`
