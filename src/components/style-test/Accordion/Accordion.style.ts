import styled from "styled-components";

export const StyledAccordion = styled.div<{ $open: boolean; $error: boolean }>`
  background-color: ${({ theme }) => theme.colors.white};
  border: ${({ $error }) => ($error ? "2px" : "1px")} solid
    ${({ $error, $open, theme }) =>
      $error ? "#d32f2f" : $open ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  transition:
    border-color 0.2s ease,
    border-width 0.2s ease;
`;

export const StyledAccordionHeader = styled.button<{ $complete: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: transparent;
  border: 0;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  color: ${({ theme }) => theme.colors.text};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}10;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }
`;

export const StyledAccordionTitle = styled.span`
  font-size: 1rem;
  font-weight: 600;
  flex: 1;
`;

export const StyledAccordionMeta = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledAccordionBadge = styled.span<{ $complete: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  background-color: ${({ $complete, theme }) =>
    $complete ? theme.colors.primary : theme.colors.border};
  color: ${({ $complete, theme }) =>
    $complete ? theme.colors.white : theme.colors.textSecondary};
`;

export const StyledAccordionChevron = styled.span<{ $open: boolean }>`
  display: inline-block;
  transition: transform 0.2s ease;
  transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.75rem;
`;

export const StyledAccordionBody = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? "1fr" : "0fr")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition:
    grid-template-rows 0.25s ease,
    opacity 0.2s ease;
`;

export const StyledAccordionBodyInner = styled.div`
  overflow: hidden;
  min-height: 0;

  > div {
    padding: ${({ theme }) => theme.spacing.sm}
      ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;
