import React from "react";
import { Button } from "../Button/Button";
import {
  StyledFooter,
  StyledFooterContent,
  StyledButtonGroup,
  StyledAlert,
  StyledAlertText,
  StyledAlertActions,
} from "./Footer.style";

interface FooterAlert {
  message: string;
  actionLabel: string;
  onAction: () => void;
}

interface FooterProps {
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  showPrevious: boolean;
  isLastStep: boolean;
  loading?: boolean;
  alert?: FooterAlert;
}

export const Footer: React.FC<FooterProps> = ({
  onPrevious,
  onNext,
  onSubmit,
  showPrevious,
  isLastStep,
  loading = false,
  alert,
}) => {
  return (
    <StyledFooter>
      <StyledFooterContent>
        {alert && (
          <StyledAlert role="alert">
            <StyledAlertText>{alert.message}</StyledAlertText>
            <StyledAlertActions>
              <Button
                type="button"
                variant="outline"
                onClick={alert.onAction}
              >
                {alert.actionLabel}
              </Button>
            </StyledAlertActions>
          </StyledAlert>
        )}
        <StyledButtonGroup>
          {showPrevious && (
            <Button type="button" variant="outline" onClick={onPrevious}>
              Anterior
            </Button>
          )}
          {isLastStep ? (
            <Button type="button" onClick={onSubmit} loading={loading}>
              Enviar
            </Button>
          ) : (
            <Button type="button" onClick={onNext} loading={loading}>
              Siguiente
            </Button>
          )}
        </StyledButtonGroup>
      </StyledFooterContent>
    </StyledFooter>
  );
};
