import styled from "styled-components";

export const StyledProgressBarContainer = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: 2px;
  overflow: hidden;
`;

export const StyledProgressBarFilled = styled.div<{ percentage: number }>`
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 2px;
  transition: width 0.3s ease;
`;
