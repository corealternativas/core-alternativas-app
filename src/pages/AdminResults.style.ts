import styled from "styled-components"

export const StyledTitle = styled.h1`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
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
      margin-top: 0.5rem;

      button {
        width: 100%;
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
  max-width: 1080px;
  max-height: 92vh;
  overflow-y: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    max-height: 100vh;
    height: 100vh;
    border-radius: 0;
    padding: ${({ theme }) => theme.spacing.md};
  }
`

export const StyledModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.md};

  h2 {
    font-size: 1.25rem;
    margin: 0 0 0.15rem 0;
    color: ${({ theme }) => theme.colors.text};
    word-break: break-word;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.textSecondary};
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

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing.sm};

    h2 {
      font-size: 1.05rem;
    }
  }
`

export const StyledDetailLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`

export const StyledDetailChart = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

export const StyledModalActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: space-between;
    width: 100%;

    button:not([aria-label="Cerrar"]) {
      flex: 1;
    }
  }
`

export const StyledOffscreen = styled.div`
  position: absolute;
  left: -10000px;
  top: 0;
  width: 1100px;
  pointer-events: none;
`
