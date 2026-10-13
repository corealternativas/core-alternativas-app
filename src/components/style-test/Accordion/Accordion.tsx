import React from "react";
import {
  StyledAccordion,
  StyledAccordionHeader,
  StyledAccordionTitle,
  StyledAccordionMeta,
  StyledAccordionBadge,
  StyledAccordionChevron,
  StyledAccordionBody,
  StyledAccordionBodyInner,
} from "./Accordion.style";

interface AccordionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  selectedCount: number;
  error?: boolean;
  children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  isOpen,
  onToggle,
  selectedCount,
  error = false,
  children,
}) => {
  const complete = selectedCount >= 1;
  const badgeLabel =
    selectedCount === 0
      ? "0 seleccionadas"
      : selectedCount === 1
        ? "1 seleccionada"
        : `${selectedCount} seleccionadas`;

  return (
    <StyledAccordion $open={isOpen} $error={error}>
      <StyledAccordionHeader
        type="button"
        $complete={complete}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <StyledAccordionTitle>{title}</StyledAccordionTitle>
        <StyledAccordionMeta>
          <StyledAccordionBadge $complete={complete}>
            {badgeLabel}
          </StyledAccordionBadge>
          <StyledAccordionChevron $open={isOpen}>▼</StyledAccordionChevron>
        </StyledAccordionMeta>
      </StyledAccordionHeader>
      <StyledAccordionBody $open={isOpen} aria-hidden={!isOpen}>
        <StyledAccordionBodyInner>
          <div>{children}</div>
        </StyledAccordionBodyInner>
      </StyledAccordionBody>
    </StyledAccordion>
  );
};
