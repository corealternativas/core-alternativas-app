import styled from "styled-components"

export const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`

export const StyledCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  max-width: 420px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
`

export const StyledTitle = styled.h1`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`

export const StyledSubtitle = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  line-height: 1.5;
`

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

export const StyledError = styled.p`
  color: #c0392b;
  font-size: 0.875rem;
  margin: 0;
`
