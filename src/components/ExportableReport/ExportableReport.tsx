import { forwardRef } from "react"
import type { Grid, GridStats } from "../../domain/categories"
import { HourGrid } from "../HourGrid/HourGrid"
import { SummaryPanel } from "../SummaryPanel/SummaryPanel"
import { ResultChart } from "../ResultChart/ResultChart"
import {
  StyledReport,
  StyledReportHeader,
  StyledTitle,
  StyledSubtitle,
  StyledBody,
  StyledGridSide,
  StyledInfoSide,
  StyledChartCard,
  StyledFootnote,
} from "./ExportableReport.style"

interface ExportableReportProps {
  title: string
  subtitle?: string
  grid: Grid
  stats: GridStats
  footnote?: string
}

export const ExportableReport = forwardRef<HTMLDivElement, ExportableReportProps>(
  ({ title, subtitle, grid, stats, footnote }, ref) => {
    return (
      <StyledReport ref={ref}>
        <StyledReportHeader>
          <StyledTitle>{title}</StyledTitle>
          {subtitle && <StyledSubtitle>{subtitle}</StyledSubtitle>}
        </StyledReportHeader>
        <StyledBody>
          <StyledGridSide>
            <HourGrid cells={grid} readOnly />
          </StyledGridSide>
          <StyledInfoSide>
            <StyledChartCard>
              <ResultChart stats={stats} />
            </StyledChartCard>
            <SummaryPanel stats={stats} />
          </StyledInfoSide>
        </StyledBody>
        {footnote && <StyledFootnote>{footnote}</StyledFootnote>}
      </StyledReport>
    )
  }
)

ExportableReport.displayName = "ExportableReport"
