import styled from "styled-components"

export const StyledContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

export const StyledSvg = styled.svg`
  display: block;
`

export const StyledCenterLabel = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  pointer-events: none;

  strong {
    font-size: 1.15rem;
    color: ${({ theme }) => theme.colors.text};
  }
`
