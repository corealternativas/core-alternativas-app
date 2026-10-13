import styled from "styled-components";

export const StyledStepSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

export const StyledStepTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1.3;
`;

export const StyledStepDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
`;
