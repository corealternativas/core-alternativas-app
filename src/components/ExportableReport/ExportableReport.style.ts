import styled from "styled-components"

export const StyledReport = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

export const StyledReportHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

export const StyledTitle = styled.h2`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`

export const StyledSubtitle = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`

export const StyledBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: ${({ theme }) => theme.spacing.md};
`

export const StyledGridSide = styled.div`
  min-width: 0;
`

export const StyledInfoSide = styled.div`
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

export const StyledFootnote = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: right;
`
