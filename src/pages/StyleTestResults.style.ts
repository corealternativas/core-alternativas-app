import styled from "styled-components"
import { Link } from "react-router-dom"

/* ───── Page shell ───── */

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

  &:focus { outline: none; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

export const Logo = styled.img`
  height: 72px;
  width: auto;
  object-fit: contain;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    height: 48px;
  }
`

export const Main = styled.main`
  flex: 1;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md}
    ${({ theme }) => theme.spacing.xxl};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.sm}
      ${({ theme }) => theme.spacing.xl};
  }
`

/* ───── Hero ───── */

export const Hero = styled.section`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

export const HeroEyebrow = styled.p`
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent-ink);
  font-weight: 700;
  margin: 0 0 10px;
`

export const HeroTitle = styled.h1`
  font-family: "Fraunces", Georgia, serif;
  font-size: 2.2rem;
  line-height: 1.1;
  letter-spacing: -0.01em;
  font-weight: 500;
  margin: 0 0 10px;
  text-wrap: balance;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.75rem;
  }
`

export const HeroGreeting = styled.p`
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  overflow-wrap: anywhere;
`

/* ───── Intro conversational block (ported from the email) ───── */

export const Intro = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: 15px;
  line-height: 1.65;

  p { margin: 0 0 10px; }
  p:last-child { margin-bottom: 0; }
  em { color: var(--accent-ink); font-style: italic; }
`

export const OwnDesc = styled.span`
  display: inline;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  background: var(--accent-soft);
  padding: 1px 6px;
  border-radius: 4px;
`

/* ───── Archetype grid (new — image per archetype, from the email) ───── */

export const Archetypes = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`

export const ArchHelp = styled.p`
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  text-align: center;
`

export const ArchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`

export const ArchCard = styled.a`
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-decoration: none;
  color: inherit;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: transform 0.2s ease;

  &:hover { transform: translateY(-3px); }

  &:focus { outline: none; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 4px;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
  }
`

export const ArchBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  padding: 6px 12px;
  background: ${({ theme }) => theme.colors.secondary};
  color: var(--accent-ink);
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.02em;
`

export const ArchRank = styled.span`
  font-family: "Fraunces", Georgia, serif;
  font-weight: 700;
  opacity: 0.8;
  font-size: 11px;
  margin-right: 2px;
`

export const ArchImgWrap = styled.div`
  aspect-ratio: 4 / 5;
  background: var(--surface-soft);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  display: block;
`

export const ArchImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`

export const ArchPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.secondary} 0%,
    var(--accent-soft) 100%
  );
`

export const ArchPlaceholderName = styled.p`
  font-family: "Fraunces", Georgia, serif;
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--accent-ink);
  margin: 0 0 4px;
  text-wrap: balance;
`

export const ArchPlaceholderSub = styled.p`
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0;
`

/* ───── Reflective text sections (from the email) ───── */

export const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

export const SectionTitle = styled.p`
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent-ink);
  font-weight: 700;
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
`

export const SectionBody = styled.div`
  font-size: 15px;
  line-height: 1.65;

  p { margin: 0 0 10px; }
  ul {
    margin: 0;
    padding-left: 20px;
  }
  li { margin-bottom: 6px; }
  li em { color: var(--accent-ink); font-style: italic; }
`

/* ───── CTA block ───── */

export const CtaBlock = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`

export const CtaBlockText = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
`

export const Cta = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14.5px;
  transition: background 0.15s ease;

  &:hover { background: var(--accent-ink); }

  &:focus { outline: none; }
  &:focus-visible {
    outline: 2px solid var(--accent-ink);
    outline-offset: 2px;
  }
`

/* ───── Answers recap (from the page) ───── */

export const Answers = styled.section`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

export const AnswersTitle = styled.h2`
  font-family: "Fraunces", Georgia, serif;
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0 0 ${({ theme }) => theme.spacing.md};
`

export const Answer = styled.div`
  margin-bottom: 18px;

  &:last-child { margin-bottom: 0; }
`

export const AnswerLabel = styled.p`
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--text-muted);
  margin: 0 0 6px;
`

export const Quote = styled.blockquote`
  margin: 0;
  padding: 10px 14px;
  background: var(--surface-soft);
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 0 ${({ theme }) => theme.borderRadius.sm}
    ${({ theme }) => theme.borderRadius.sm} 0;
  font-size: 14.5px;
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
  padding: 3px 10px;
  background: var(--surface-soft);
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
`

/* ───── Share link block ───── */

export const Share = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px dashed var(--border-strong);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

export const ShareLabel = styled.p`
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--text-muted);
  margin: 0 0 10px;
`

export const ShareRow = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`

export const ShareUrl = styled.input`
  flex: 1;
  min-width: 0;
  padding: 9px 12px;
  background: var(--surface-soft);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.textSecondary};

  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`

export const ShareCopy = styled.button`
  padding: 9px 14px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;

  &:hover { background: var(--surface-soft); }

  &:focus { outline: none; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

/* ───── Signature + replay footer ───── */

export const Signature = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  margin: 0 0 ${({ theme }) => theme.spacing.lg};

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
  }
`

export const FooterCta = styled.div`
  display: flex;
  justify-content: center;
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

export const Retry = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: transparent;
  border: 1px solid var(--border-strong);
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 500;

  &:hover { background: var(--surface-soft); }

  &:focus { outline: none; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

/* ───── Status / retry (loading / 404 / network error) ───── */

export const StatusBox = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  background: var(--surface-soft);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-align: center;

  h2 {
    font-family: "Fraunces", Georgia, serif;
    font-size: 1.3rem;
    font-weight: 500;
    margin: 0 0 ${({ theme }) => theme.spacing.xs};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.5;
  }
`

export const RetryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.25rem;
  margin-top: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 999px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;

  &:hover { background: ${({ theme }) => theme.colors.secondary}; }

  &:focus { outline: none; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`
