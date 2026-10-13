import React from "react"
import { TOTAL_CELLS, type GridStats } from "../../domain/categories"
import { CategoryIcon } from "../Icons/CategoryIcon"
import {
  StyledContainer,
  StyledTitle,
  StyledList,
  StyledRow,
  StyledSwatch,
  StyledLabel,
  StyledValues,
  StyledTotal,
} from "./SummaryPanel.style"

interface SummaryPanelProps {
  stats: GridStats
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ stats }) => {
  return (
    <StyledContainer>
      <StyledTitle>Resumen</StyledTitle>
      <StyledList>
        {stats.perCategory.map((s) => (
          <StyledRow key={s.code}>
            <StyledSwatch $color={s.color}>
              <CategoryIcon code={s.code} size={16} />
            </StyledSwatch>
            <StyledLabel>{s.label}</StyledLabel>
            <StyledValues>
              <strong>{s.hours}h</strong>
              <span>{s.percent.toFixed(1)}%</span>
            </StyledValues>
          </StyledRow>
        ))}
      </StyledList>
      <StyledTotal>
        Asignado: <strong>{stats.totalAssigned}</strong> / {TOTAL_CELLS} hs
      </StyledTotal>
    </StyledContainer>
  )
}
