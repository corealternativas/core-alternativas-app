import styled from "styled-components"

export const StyledField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
`

export const StyledLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`

export const StyledInputWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
`

interface InputProps {
  $hasError?: boolean
  $hasSuffix?: boolean
}

export const StyledInput = styled.input<InputProps>`
  flex: 1;
  padding: 0.7rem 0.9rem;
  padding-right: ${({ $hasSuffix }) => ($hasSuffix ? "2.6rem" : "0.9rem")};
  border: 1px solid
    ${({ theme, $hasError }) =>
      $hasError ? "#c0392b" : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.white};
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  width: 100%;
  min-width: 0;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(206, 107, 0, 0.15);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.surface};
    cursor: not-allowed;
    opacity: 0.7;
  }
`

export const StyledToggleButton = styled.button`
  position: absolute;
  top: 50%;
  right: 0.55rem;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: background-color 0.12s ease, color 0.12s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

export const StyledError = styled.span`
  font-size: 0.8rem;
  color: #c0392b;
`
