import React from "react"
import type { GridStats } from "../../domain/categories"
import { StyledSvg, StyledCenterLabel, StyledContainer } from "./ResultChart.style"

interface ResultChartProps {
  stats: GridStats
  size?: number
}

const RADIUS = 42
const INNER_RADIUS = 24
const CIRC = 2 * Math.PI * RADIUS

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  }
}

function describeArc(cx: number, cy: number, r: number, rInner: number, startAngle: number, endAngle: number) {
  const startOuter = polarToCartesian(cx, cy, r, endAngle)
  const endOuter = polarToCartesian(cx, cy, r, startAngle)
  const startInner = polarToCartesian(cx, cy, rInner, endAngle)
  const endInner = polarToCartesian(cx, cy, rInner, startAngle)
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0
  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${r} ${r} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 1 ${startInner.x} ${startInner.y}`,
    "Z",
  ].join(" ")
}

export const ResultChart: React.FC<ResultChartProps> = ({ stats, size = 220 }) => {
  const total = stats.totalAssigned
  const segments = stats.perCategory.filter((s) => s.hours > 0)

  if (total === 0) {
    return (
      <StyledContainer>
        <StyledSvg viewBox="-50 -50 100 100" style={{ width: size, height: size }}>
          <circle cx={0} cy={0} r={RADIUS} fill="#f4f4f4" />
          <circle cx={0} cy={0} r={INNER_RADIUS} fill="#ffffff" />
        </StyledSvg>
        <StyledCenterLabel>Sin datos</StyledCenterLabel>
      </StyledContainer>
    )
  }

  let cumulative = 0
  return (
    <StyledContainer>
      <StyledSvg viewBox="-50 -50 100 100" style={{ width: size, height: size }}>
        {segments.length === 1 ? (
          <>
            <circle cx={0} cy={0} r={RADIUS} fill={segments[0].color} />
            <circle cx={0} cy={0} r={INNER_RADIUS} fill="#ffffff" />
            <title>{`${segments[0].label}: ${segments[0].hours}h (${segments[0].percent.toFixed(1)}%)`}</title>
          </>
        ) : (
          <>
            {segments.map((s) => {
              const start = (cumulative / total) * Math.PI * 2 - Math.PI / 2
              cumulative += s.hours
              const end = (cumulative / total) * Math.PI * 2 - Math.PI / 2
              const path = describeArc(0, 0, RADIUS, INNER_RADIUS, start, end)
              return (
                <path key={s.code} d={path} fill={s.color} stroke="#ffffff" strokeWidth={0.5}>
                  <title>
                    {s.label}: {s.hours}h ({s.percent.toFixed(1)}%)
                  </title>
                </path>
              )
            })}
          </>
        )}
      </StyledSvg>
      <StyledCenterLabel>
        <strong>{total}h</strong>
        <span>asignadas</span>
      </StyledCenterLabel>
    </StyledContainer>
  )
}

// Avoid unused warning for CIRC helper constant (kept for reference of full arc length)
void CIRC
