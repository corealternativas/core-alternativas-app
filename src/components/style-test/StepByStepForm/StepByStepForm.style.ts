import styled from "styled-components";

// Layout Wrappers - Main container with sticky header/footer
export const StyledPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
`;

// Scrollable middle section
export const StyledMiddleSection = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 0;
  margin-bottom: 80px;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.lg} 0;
    margin-bottom: 160px;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme.colors.textSecondary};
    }
  }
`;

// Main content wrapper inside scrollable section
export const StyledMainContent = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.spacing.lg};
    width: 85%;
  }
`;

// Title section above columns (full width)
export const StyledTitleSection = styled.div`
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

export const StyledContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const StyledLeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

export const StyledRightColumn = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

// Typography
export const StyledFormTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1.2;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2rem;
  }
`;

export const StyledFormDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 0.95rem;
  }
`;

export const StyledSubtitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1.3;
`;

export const StyledLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

// Form Sections
export const StyledFormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const StyledFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledCheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

export const StyledModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: ${({ theme }) => theme.spacing.md};
`;

export const StyledModalCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 520px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

export const StyledModalTitle = styled.h3`
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const StyledModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`;

export const StyledAccordionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const StyledRadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

export const StyledSelectGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const StyledPrivacySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  /* padding: ${({ theme }) => theme.spacing.sm}; */
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

export const StyledPrivacyText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// Buttons
export const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    flex-direction: column-reverse;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
    padding-bottom: max(
      ${({ theme }) => theme.spacing.md},
      env(safe-area-inset-bottom)
    );
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 0;
    margin-top: ${({ theme }) => theme.spacing.lg};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.white};
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
    z-index: 50;
    max-width: 100%;
    width: 100%;

    button {
      width: 100%;
    }
  }
`;

// Legacy compatibility
export const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const StyledHeaderSection = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.lg} 0;
  }
`;

export const StyledFormContent = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;
  flex: 1;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    max-width: 100%;
    padding: 0;
    gap: ${({ theme }) => theme.spacing.lg};
    align-items: stretch;
  }
`;

export const StyledStepsColumn = styled.div`
  position: sticky;
  top: 0;
  height: fit-content;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: static;
    top: auto;
    height: auto;
  }
`;

export const StyledFormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  position: relative;
  padding-bottom: 120px;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  padding-right: ${({ theme }) => theme.spacing.md};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme.colors.textSecondary};
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding-bottom: 0;
    overflow-y: visible;
    max-height: auto;
    padding-right: 0;
  }
`;
