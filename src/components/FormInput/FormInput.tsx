import React, { useState } from "react"
import { EyeIcon, EyeOffIcon } from "../Icons/CategoryIcon"
import {
  StyledField,
  StyledLabel,
  StyledInput,
  StyledInputWrapper,
  StyledToggleButton,
  StyledError,
} from "./FormInput.style"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  id,
  type,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)
  const isPassword = type === "password"
  const [visible, setVisible] = useState(false)
  const effectiveType = isPassword && visible ? "text" : type

  return (
    <StyledField>
      {label && <StyledLabel htmlFor={inputId}>{label}</StyledLabel>}
      <StyledInputWrapper>
        <StyledInput
          id={inputId}
          $hasError={!!error}
          $hasSuffix={isPassword}
          type={effectiveType}
          {...props}
        />
        {isPassword && (
          <StyledToggleButton
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={visible}
            tabIndex={-1}
          >
            {visible ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </StyledToggleButton>
        )}
      </StyledInputWrapper>
      {error && <StyledError>{error}</StyledError>}
    </StyledField>
  )
}
