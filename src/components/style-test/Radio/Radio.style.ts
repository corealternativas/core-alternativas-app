import styled from 'styled-components'

export const StyledRadio = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

export const StyledRadioInput = styled.input`
  width: 20px;
  height: 20px;
  margin-top: 2px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

export const StyledRadioLabel = styled.label`
  font-size: 1em;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  flex: 1;
  line-height: 1.5;
`
