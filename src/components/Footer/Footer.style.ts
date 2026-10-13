import styled from "styled-components"

export const StyledFooter = styled.footer`
  background-color: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`

export const StyledFooterContent = styled.div`
  width: 85%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 90%;
  }
`

export const StyledCopyright = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 0.8rem;
  }
`
