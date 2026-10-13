import React from "react";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import {
  StyledHeader,
  StyledHeaderContent,
  StyledLogoWrapper,
  StyledLogo,
  StyledStepInfo,
  StyledStepCounter,
  StyledProgressBarWrapper,
} from "./Header.style.ts";

interface HeaderProps {
  currentStep?: number;
  totalSteps?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep = 1,
  totalSteps = 7,
}) => {
  return (
    <StyledHeader>
      <StyledHeaderContent>
        <StyledLogoWrapper>
          <StyledLogo src="/coreLogo.webp" alt="CORE" />
        </StyledLogoWrapper>

        <StyledStepInfo>
          <StyledStepCounter>
            Paso {currentStep} de {totalSteps}
          </StyledStepCounter>
          <StyledProgressBarWrapper>
            <ProgressBar current={currentStep} total={totalSteps} />
          </StyledProgressBarWrapper>
        </StyledStepInfo>
      </StyledHeaderContent>
    </StyledHeader>
  );
};
