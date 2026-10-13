import styled from "styled-components"

export const StyledContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
`

export const StyledTitle = styled.h3`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`

export const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const StyledRow = styled.div`
  display: grid;
  grid-template-columns: 32px 1fr auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.35rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`

export const StyledSwatch = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ $color }) => $color};
  color: rgba(0, 0, 0, 0.7);
`

export const StyledLabel = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
`

export const StyledValues = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.1rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.9rem;
  }
`

export const StyledTotal = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: right;

  strong {
    color: ${({ theme }) => theme.colors.text};
  }
`
