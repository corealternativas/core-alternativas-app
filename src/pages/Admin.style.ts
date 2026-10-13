import styled from "styled-components"

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`

export const StyledTitle = styled.h1`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`

export const StyledTableWrapper = styled.div`
  overflow-x: auto;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th, td {
    padding: 0.8rem 1rem;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  th {
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    white-space: nowrap;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;

    thead {
      display: none;
    }

    tbody, tr {
      display: block;
    }

    tr {
      padding: 0.75rem;
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    }

    tbody tr:last-child {
      border-bottom: none;
    }

    td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: ${({ theme }) => theme.spacing.sm};
      padding: 0.35rem 0;
      border-bottom: none;

      &::before {
        content: attr(data-label);
        font-weight: 600;
        color: ${({ theme }) => theme.colors.textSecondary};
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.02em;
        flex-shrink: 0;
      }
    }

    td[data-label="Acciones"] {
      flex-direction: column;
      align-items: stretch;
      margin-top: 0.5rem;

      &::before {
        text-align: left;
      }
    }
  }
`

export const StyledStatus = styled.span<{ $active: boolean }>`
  display: inline-block;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ $active }) => ($active ? "#1e6f2b" : "#7a2b2b")};
  background-color: ${({ $active }) => ($active ? "#e6f4ea" : "#fbe9e7")};
`

export const StyledInlineActions = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;

  button {
    padding: 0.35rem 0.7rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.text};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-size: 0.8rem;
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.surface};
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
`

export const StyledEmpty = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`

export const StyledError = styled.div`
  padding: 0.75rem 1rem;
  background-color: #fbe9e7;
  color: #7a2b2b;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 0.9rem;
`

export const StyledModal = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  z-index: 1000;
`

export const StyledModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 460px;
  max-height: 90vh;
  overflow-y: auto;
`

export const StyledModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  h2 {
    font-size: 1.25rem;
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
  }

  button {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.textSecondary};
    padding: 0.25rem 0.5rem;
    border-radius: ${({ theme }) => theme.borderRadius.sm};

    &:hover {
      background-color: ${({ theme }) => theme.colors.surface};
    }
  }
`

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

export const StyledFieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }
`

export const StyledSelect = styled.select`
  padding: 0.7rem 0.9rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

export const StyledActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.sm};
`
