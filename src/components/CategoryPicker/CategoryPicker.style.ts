import styled from "styled-components"

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const StyledHint = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`

export const StyledButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: 0.4rem;
  }
`

interface ButtonProps {
  $color?: string
  $active: boolean
}

export const StyledButton = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.9rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px solid
    ${({ $active, theme }) => ($active ? theme.colors.text : "transparent")};
  background-color: ${({ $color }) => $color || "#f2f2f2"};
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  min-width: 110px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: 1 1 calc(33.333% - 0.4rem);
    min-width: 0;
    padding: 0.45rem 0.5rem;
    gap: 0.35rem;
    font-size: 0.85rem;
    justify-content: center;
  }
`

export const StyledEraser = styled(StyledButton)`
  background-color: ${({ theme }) => theme.colors.white};
  border-color: ${({ $active, theme }) =>
    $active ? theme.colors.text : theme.colors.border};
`

export const StyledIconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.08);
  color: rgba(0, 0, 0, 0.75);
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 22px;
    height: 22px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`

export const StyledLabel = styled.span`
  font-size: 0.9rem;
`
