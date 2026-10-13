import styled from "styled-components";

export const StyledHeader = styled.header`
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  overflow-x: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    /* remove side padding on mobile, keep vertical spacing */
    padding: ${({ theme }) => theme.spacing.sm} 0;
  }
`;

export const StyledHeaderContent = styled.div`
  width: 85%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 85%;
  }
`;

export const StyledLogoWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

export const StyledLogo = styled.img`
  height: 80px;
  width: auto;
  object-fit: contain;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    height: 80px;
  }
`;

export const StyledStepInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

export const StyledStepCounter = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: right;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 0.75rem;
  }
`;

export const StyledProgressBarWrapper = styled.div`
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-width: 70px;
    flex-shrink: 0;
  }
`;
