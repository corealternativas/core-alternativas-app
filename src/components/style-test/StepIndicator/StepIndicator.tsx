import React from "react";
import {
  StyledStepSidebar,
  StyledStepTitle,
  StyledStepDescription,
} from "./StepIndicator.style.ts";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
  onStepClick?: (step: number) => void;
  stepDescriptions?: string[];
}

const STEP_DESCRIPTIONS: Record<number, string> = {
  1: "Cuéntanos sobre tu estilo",
  2: "Elegí los adjetivos que te representan",
  3: "¿Cuánto tiempo tienes disponible?",
  4: "Género y ubicación",
  5: "Tus datos y consentimiento",
};

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  steps,
  stepDescriptions = STEP_DESCRIPTIONS,
}) => {
  const stepTitle = steps[currentStep - 1];
  const stepDescription = stepDescriptions[currentStep];

  return (
    <StyledStepSidebar>
      <StyledStepTitle>{stepTitle}</StyledStepTitle>
      <StyledStepDescription>{stepDescription}</StyledStepDescription>
    </StyledStepSidebar>
  );
};
