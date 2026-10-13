import styled from 'styled-components'

export const StyledSelect = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

export const StyledLabel = styled.label`
  font-weight: 600;
  font-size: 1em;
  color: ${({ theme }) => theme.colors.text};
  display: block;
`

export const RequiredIndicator = styled.span`
  color: #d32f2f;
`

export const StyledSelectElement = styled.select<{ error?: boolean }>`
  width: 100%;
  padding: 0.75em 1em;
  border: 1px solid ${({ error, theme }) => (error ? '#d32f2f' : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 1em;
  font-family: inherit;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  option {
    padding: 0.5em;
  }
`

export const StyledHelperText = styled.p<{ error?: boolean }>`
  font-size: 0.875em;
  color: ${({ error, theme }) => (error ? '#d32f2f' : theme.colors.textSecondary)};
  margin: 0;
`
