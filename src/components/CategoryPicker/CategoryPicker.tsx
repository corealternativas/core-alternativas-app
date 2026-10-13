import React from "react"
import { CATEGORIES, type CategoryCode } from "../../domain/categories"
import { CategoryIcon, EraserIcon } from "../Icons/CategoryIcon"
import {
  StyledContainer,
  StyledButtons,
  StyledButton,
  StyledIconWrap,
  StyledLabel,
  StyledEraser,
  StyledHint,
} from "./CategoryPicker.style"

interface CategoryPickerProps {
  active: CategoryCode | null
  onChange: (code: CategoryCode | null) => void
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({ active, onChange }) => {
  return (
    <StyledContainer>
      <StyledHint>Seleccioná una categoría y pintá las horas (podés arrastrar).</StyledHint>
      <StyledButtons>
        {CATEGORIES.map((cat) => (
          <StyledButton
            key={cat.code}
            type="button"
            $color={cat.color}
            $active={active === cat.code}
            onClick={() => onChange(cat.code)}
            title={cat.description}
          >
            <StyledIconWrap>
              <CategoryIcon code={cat.code} size={18} />
            </StyledIconWrap>
            <StyledLabel>{cat.label}</StyledLabel>
          </StyledButton>
        ))}
        <StyledEraser
          type="button"
          $active={active === null}
          onClick={() => onChange(null)}
          title="Borrar celdas"
        >
          <StyledIconWrap>
            <EraserIcon size={18} />
          </StyledIconWrap>
          <StyledLabel>Borrar</StyledLabel>
        </StyledEraser>
      </StyledButtons>
    </StyledContainer>
  )
}
