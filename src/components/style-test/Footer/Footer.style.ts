import styled from "styled-components";

export const StyledFooter = styled.footer`
  background-color: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.md};
    padding-bottom: max(
      ${({ theme }) => theme.spacing.md},
      env(safe-area-inset-bottom)
    );
  }
`;

export const StyledFooterContent = styled.div`
  max-width: 1100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: stretch;
`;

export const StyledAlert = styled.div`
  background-color: #fff4e6;
  border: 1px solid #f0b46b;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const StyledAlertText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-line;
  flex: 1;
`;

export const StyledAlertActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
`;

export const StyledButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  align-self: stretch;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    flex-direction: column-reverse;
    gap: ${({ theme }) => theme.spacing.sm};

    button {
      width: 100%;
    }
  }
`;
