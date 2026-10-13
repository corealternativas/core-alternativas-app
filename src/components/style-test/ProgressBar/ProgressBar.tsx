import React from "react";
import {
  StyledProgressBarContainer,
  StyledProgressBarFilled,
} from "./ProgressBar.style";

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <StyledProgressBarContainer>
      <StyledProgressBarFilled percentage={percentage} />
    </StyledProgressBarContainer>
  );
};
