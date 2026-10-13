import styled from "styled-components"

export const StyledOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  z-index: 1200;
  animation: fadeIn 0.12s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

export const StyledCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 440px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
`

export const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

export const StyledTitle = styled.h2`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`

export const StyledClose = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0.15rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
  }
`

export const StyledMessage = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

export const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

export const StyledActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`

export const StyledError = styled.p`
  color: #7a2b2b;
  background-color: #fbe9e7;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.85rem;
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`
