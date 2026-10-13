import styled from "styled-components"

export const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

export const StyledTitle = styled.h1`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 0.25rem 0;
`

export const StyledStatus = styled.span<{ $dirty: boolean }>`
  font-size: 0.85rem;
  color: ${({ $dirty, theme }) => ($dirty ? "#c0392b" : theme.colors.textSecondary)};
`

export const StyledLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`

export const StyledLeft = styled.div`
  min-width: 0;
`

export const StyledRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

export const StyledChartCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: center;
`

export const StyledToolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: sticky;
    bottom: 0;
    padding: 0.75rem 0.5rem;
    margin-left: -0.5rem;
    margin-right: -0.5rem;
    margin-top: ${({ theme }) => theme.spacing.md};
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(6px);
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    z-index: 50;
    gap: 0.5rem;

    button {
      flex: 1 1 auto;
      padding: 0.6rem 0.5rem;
      font-size: 0.85rem;
      white-space: nowrap;
    }
  }
`

export const StyledError = styled.div`
  padding: 0.6rem 1rem;
  background-color: #fbe9e7;
  color: #7a2b2b;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 0.9rem;
`

/* Hidden export target rendered off-screen with a fixed width for reliable image export. */
export const StyledOffscreen = styled.div`
  position: absolute;
  left: -10000px;
  top: 0;
  width: 1100px;
  pointer-events: none;
`
