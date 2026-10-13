import styled from "styled-components"

export const StyledLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

export const StyledMain = styled.main`
  flex: 1;
  width: 85%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
  }
`
