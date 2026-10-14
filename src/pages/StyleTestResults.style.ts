import styled from "styled-components"
import { Link } from "react-router-dom"

export const Page = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
`

export const PageHeader = styled.header`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

export const LogoLink = styled(Link)`
  display: inline-flex;
  border-radius: 4px;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

export const Logo = styled.img`
  height: 48px;
  width: auto;
  object-fit: contain;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    height: 36px;
  }
`

export const Main = styled.main`
  flex: 1;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.sm};
  }
`

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
  text-align: center;
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.4rem;
  }
`

export const Greeting = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin: ${({ theme }) => theme.spacing.xs} 0 ${({ theme }) => theme.spacing.lg};
  overflow-wrap: anywhere;
`

export const Section = styled.section`
  margin-top: ${({ theme }) => theme.spacing.lg};
`

export const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
`

export const StyleList = styled.ol`
  list-style: none;
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const StyleCard = styled.li<{ $first?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.secondary};
  border: 1px solid
    ${({ $first, theme }) => ($first ? theme.colors.primary : "transparent")};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`

export const Rank = styled.span`
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  font-size: 1rem;
`

export const StyleName = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.25;
  overflow-wrap: anywhere;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.1rem;
  }
`

export const Answer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }
`

export const AnswerLabel = styled.p`
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
`

export const Quote = styled.blockquote`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: var(--surface-soft);
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 0 ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md} 0;
  font-size: 0.95rem;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.secondary};
  color: var(--accent-ink);
  font-size: 0.85rem;
  font-weight: 500;
`

export const Suggestion = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`

export const StatusBox = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  background: var(--surface-soft);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-align: center;

  h2 {
    font-size: 1.2rem;
    margin: 0 0 ${({ theme }) => theme.spacing.xs};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.5;
  }
`

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
`

const ctaBase = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
`

export const CtaLink = styled(Link)`
  ${ctaBase}
  background: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  transition: background-color 0.15s ease;

  &:hover {
    background: var(--accent-ink);
    border-color: var(--accent-ink);
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

export const RetryButton = styled.button`
  ${ctaBase}
  margin-top: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`
