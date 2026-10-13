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
  max-width: 420px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
`

export const StyledTitle = styled.h2`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`

export const StyledMessage = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

export const StyledActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`
